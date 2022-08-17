const { DietType, Recipe } = require('../db.js');
const ModelCrud = require('./index');

const preloadDiets =()=>{
    let glutenFree = DietType.findOrCreate({
        where: { id: 1, name: "gluten free", },
      });
      let dairyFree = DietType.findOrCreate({
        where: { id: 2, name: "dairy free", },
      });
      let ketogenic = DietType.findOrCreate({
        where: { id: 3, name: "ketogenic",  },
      });
      let vegetarian = DietType.findOrCreate({
        where: { id: 4, name: "vegetarian", },
      });
      let lactoVegetarian = DietType.findOrCreate({
        where: { id: 5, name: "lacto ovo vegetarian",  },
      });
      let ovoVegetarian = DietType.findOrCreate({
        where: { id: 6, name: "ovo vegetarian", },
      });
      let vegan = DietType.findOrCreate({
        where: { id: 7, name: "vegan",      },
      });
      let pescetarian = DietType.findOrCreate({
        where: { id: 8, name: "pescatarian",},
      });
      let paleo = DietType.findOrCreate({
        where: { id: 9, name: "paleolithic",     },
      });
      let fodmapFriendly = DietType.findOrCreate({
        where: { id: 10, name: "fodmap friendly", },
      });
      let primal = DietType.findOrCreate({
        where: { id: 11, name: "primal",      },
      });
      let whole = DietType.findOrCreate({
        where: { id: 12, name: "whole 30",   },
      });
  
      Promise.all([
        glutenFree,
        dairyFree,
        ketogenic,
        vegetarian,
        lactoVegetarian,
        ovoVegetarian,
        vegan,
        pescetarian,
        paleo,
        fodmapFriendly,
        primal,
        whole
      ]).then(() => {
        console.log('preloaded DietTypes');
      })
}

class dietTypeModel extends ModelCrud {
    constructor(model) {
        super (model);      
    }
    getAll = async (req, res) => {
        preloadDiets();
        const dietTypes = await DietType.findAll({
            include: [{
                model: Recipe,       
                attributes: ['id']
            }]
        });
        res.status(200).send(dietTypes);
    };
}
const dietTypeController = new dietTypeModel(DietType);
module.exports = dietTypeController;
