const mongoose = require("mongoose");

const mealSchema = mongoose.Schema({

  title: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    enum: ['vegan' , 'vegetarian' ,'non-vegetarian'],
    ref: "Category",
  },
  description: {
    type: String,
    minLength: 2,
  },
  price: String,
  orderNo: {
    type: Number,
    default: 0,
    autoIncrement: true
  },
  ingrediants: {
    type: [String],
  },
  
  exclude:{
    type: [String],
    // validate: {
    //   validator: function (value , doc) {
    //     console.log(doc)
    //     return value.some(item => {
    //       return doc.ingredients.find(item);  
    //     });

    // },
    //   message: 'Excluded items must be present in ingredients'
    // }
    
  },

  imageFile: {
    type: String,
    // required: true,
  },
});


const Meal = mongoose.model('Meal' , mealSchema)



module.exports= Meal





         // return (
        //   this.ingrediants &&
        //   value.some(item => this.ingrediants.includes(item))
        // );
        //return value.some(item => this.ingrediants.includes(item))

      
      //   // const ingrediants = await this.model('Meal').select('ingrediants');
      //   // return (
      //   //   ingrediants &&
      //   //   value.some(item => ingrediants.ingrediants.includes(item))
      //   // );
      // },

      // validator: function (value) {
      //   return value.every(function (item) {
      //       // Assuming "name" is the property for ingredient identification:
      //       return this.ingredients.some(function (ingredient) { ingredient.name === item});
      //   });