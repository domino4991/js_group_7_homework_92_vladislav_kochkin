const router = require('express').Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password
        });
        user.genToken();
        await user.save();
        return res.send({message: 'Регистрация прошла успешно. Вы будете перенаправлены на страницу входа.'});
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.post('/sessions', async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user) return res.status(404).send({error: 'Пользователь не найден'});
        const isMatch = await user.checkPass(req.body.password);
        if(!isMatch) return res.status(400).send({error: 'Неверный пароль'});
        user.genToken();
        await user.save({validateBeforeSave: false});
        return res.send({
            username: user.username,
            token: user.token
        });
    } catch (e) {
        return res.status(400).send(e);
    }
});

router.delete('/sessions', async (req, res) => {
    const token = req.get('Authorization');
    try {
        const success = {message: 'Success'};
        if (!token) return res.send(success);
        const user = await User.findOne({token});
        if (!user) return res.send(success);
        user.genToken();
        await user.save({validateBeforeSave: false});
        return res.send({message: 'Вы вышли из системы'});
    } catch (e) {
        return res.status(500).send({error: 'Eternal server error'});
    }
});

module.exports = router;