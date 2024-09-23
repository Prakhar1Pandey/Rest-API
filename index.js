const express = require('express');
const fs = require('fs');
const users = require('./MOCK_DATA.json');
const app = express();
const PORT = 8000;

//Middleware - Plugin
app.use(express.urlencoded({ extended: false }));
app.get('/users',(req,res)=>{
    const html=`
    <ul>
    ${users.map(user=>`<li>${user.first_name}</li>`).join('')}
    </ul>
    `;
    res.send(html);
});

app.get('/api/users', (req, res) => {
    return res.json(users);
});

app.get('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
});

app.post('/api/users', (req, res) => {
    const body = req.body;
    users.push({...body,id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error writing to file' });
        }
        });
    return res.json({ status: 'Creating user...', body: body });
});

app.patch('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex] = { ...users[userIndex], ...body };

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error writing to file' });
        }
    });

    return res.json({ status: 'User updated', user: users[userIndex] });
});
app.delete('/api/users/:id', (req, res) => {
    const id = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1);

    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error writing to file' });
        }
    });

    return res.json({ status: 'User deleted', user: deletedUser[0] });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

