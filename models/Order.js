const mongoose = require("mongoose");

const getCurrentDatePlus10Days = () => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 10);
    return currentDate;
};

const OrderSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        products: [
            {
                productId: {
                    type: String,
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        amount: { type: Number, required: true },
        address: { type: Object, required: true },
        status: { type: String, default: "Not Delivered" },
        date: { type: Date, default : getCurrentDatePlus10Days  }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);