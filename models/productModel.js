const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        img: {
            type: String,
            required: [true, 'El product debe tener una imagen ilustrativa']
        },
        name: {
            type: String,
            required: [true, 'El producto debe tener un nombre'],
            unique: true,
            trim: true
        },
        slug: String,
        uses: {
            type: Object,
            required: false
        },
        type: {
            type: String,
            required: [true, 'Por favor indica el tipo de producto']
        },
        query: {
            type: String,
            required: [true, 'Por favor indica de que manera pueden buscar este producto']
        },
        variations: {
            type: Object,
            varImgs: {
                type: Array,
                required: [true, 'almenos anade una image para mostrar'],
                maxlength: 4
            },
            varTexts: {
                type: Array,
                required: [true, 'Indica por orden el nombre de las imagenes anadidas'],
                maxlength: 4
            },
        }
    }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;