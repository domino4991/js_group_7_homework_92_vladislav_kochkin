const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: [true, 'Сообщение не должно быть пустым.']
    },
    datetime: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;