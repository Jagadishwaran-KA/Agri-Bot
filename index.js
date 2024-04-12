const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = process.env.PORT || 3000;

// Twilio credentials

const products = [
    {
        name: 'carrot',
        price: '₹:20 per kg',
        description: 'Carrots are a root vegetable that are rich in vitamin A and antioxidants. They are crunchy, tasty, and nutritious.',
        image: "https://images.unsplash.com/photo-1582515073490-39981397c445?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2Fycm90fGVufDB8fDB8fHww"
    },
    {
        name: 'tomato',
        price: '₹:30 per kg',
        description: 'Tomatoes are a juicy fruit that are widely used in cooking and salads. They are rich in vitamins and minerals.',
        image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG9tYXRvfGVufDB8fDB8fHww'

    },
    {
        name: 'potato',
        price: '₹:40 per kg',
        description: 'Potatoes are a versatile vegetable that can be cooked in various ways. They are a good source of carbohydrates and nutrients.',
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cG90YXRvfGVufDB8fDB8fHww"
    },
    {
        name: 'Rice',
        price: '₹:55 per kg',
        description: 'Rice is a staple food for many cultures. It is a versatile grain that can be used in a variety of dishes.',
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmljZXxlbnwwfHwwfHx8MA%3D%3D"
    }
];


app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", (req, res) => {
    console.log("Agri Connect")
    res.send("Hello Mother fucker")
})

app.post('/incoming', async (req, res) => {

    const incomingMessage = req.body.Body.toLowerCase();
    const senderNumber = req.body.From;

    let responseMessage = '';
    let mediaUrl = '';




    switch (incomingMessage) {
        case 'hello' || "start":
            responseMessage = 'Hello! Welcome to Agri Connect. You can view our products by sending "List product" as a message.';
            break;
        case 'list products':
            responseMessage = 'Here are our agricultural products:\n';
            products.forEach(product => {
                responseMessage += `${product.name}\n`;
            });
            break;
        default:
            const product = products.find(p => p.name === incomingMessage);
            if (product) {
                responseMessage = `${product.name}\nPrice: ${product.price}\nDescription: ${product.description}`;
                mediaUrl = product.image;
            } else {
                responseMessage = 'Sorry, I didn\'t understand that. Please send "list products" to view available products or the name of a specific product to get its price and description.';
            }
            break;
    }

    try {
        await client.messages.create({
            body: responseMessage,
            from: `whatsapp:${twilioNumber}`,
            to: senderNumber
        });

        if (mediaUrl !== '') {
            await client.messages.create({
                mediaUrl: [mediaUrl],
                from: `whatsapp:${twilioNumber}`,
                to: senderNumber
            });
        }

        console.log('Reply sent successfully');
        res.status(200).end();
    } catch (error) {
        console.error('Error sending reply:', error);
        res.status(500).end();
    }

});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
