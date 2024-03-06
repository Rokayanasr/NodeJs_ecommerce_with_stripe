const Meal = require("../models/meal");


const getAllMeals = async () => {
  try {
    let data = await Meal.find();
    return data;
  } catch (e) {
    console.log(e);
  }
};

const addNew = async (
  _title,
  _category,
  _description,
  _price,
  _ingrediants,
  _exclude,
  _imageFile,
) => {
  try {
    let data = await Meal.create({
      title: _title,
      category: _category,
      description: _description,
      price: _price,
      ingrediants: _ingrediants,
      exclude: _exclude,
      imageFile: _imageFile,
    });
    // console.log(data)
    return data;
  } catch (e) {
    console.log(e);
  }
};

const deleteItem = async (_id) => {
  try {
    let data = await Meal.deleteOne({ _id: _id });
    return data;
  } catch (e) {
    console.log(e);
  }
};

const editItem = async (
  _id,
  _image,
  _title,
  _category,
  _description,
  _price,
  _ingrediants,

  _exclude
) => {
  try {
    let data = await Meal.updateOne(
      { _id: _id },
      {
        $set: {
          image: _image,
          title: _title,
          category: _category,
          description: _description,
          price: _price,
          ingrediants: _ingrediants,
   
          exclude: _exclude,
        },
      }
    );
    return data;
  } catch (e) {
    console.log(e);
  }
};

const filterMealsCat = async (_category) => {
  try {
    const data = await Meal.find({ category: _category });
    return data;
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const filterMealsPri = async (_price) => {
  try {


    if (typeof _price === "string") {
      const data = await Meal.find({ price: _price });

      return data;
    } else if (Array.isArray(_price)) {
 
      const data = await Meal.find({
        $and: [
        
          {
            price: { $gte: _price[0] },
          },
          {
            price: { $lte: _price[1] },
          },
        ],
      });
   

      return data;
    }
  } catch (err) {
    console.log(err);

    res.status(500).json({ message: err });
  }
};

module.exports = {
  getAllMeals,
  addNew,
  deleteItem,
  editItem,
  filterMealsCat,
  filterMealsPri,
};
