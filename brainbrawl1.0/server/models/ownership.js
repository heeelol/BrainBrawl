const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
    item_id: {
        type: String
    }
})

const ownershipSchema = new Schema({
    user_email: {
        type: String,
    },
    item_list: [itemSchema],
    selected_avatar: { 
            type: String,
            default: ""
        }
});

module.exports = mongoose.model('Ownership', ownershipSchema);