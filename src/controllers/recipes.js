// Models --> "Objeto" que se comunica con la base de datos.
// Rutas --> Puertas de entrada a la api.
// Controlador --> Intermediario entre las rutas y nuestra base de datos. 
const { Recipe, DietType, recipe_dietType } = require('../db');
const ModelCrud = require('./index');
const { API_KEY } = process.env;
const { Op }= require('sequelize');
const { URL_RECIPEID, URL_RECIPESCOMPLEX } = require('../constants');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

class RecipeModel extends ModelCrud {
    constructor(model) {
        super (model);
    }
    getAll = async (req, res, next) => {
        let {name} = req.query;
        let attrDb = ['id', 'title', 'summary', 'image', 'instructions', 'healthScore'];
        let whereDb = {};
        let includeDb = [{model: DietType,}];
        let title='';
        let queryApi=`${URL_RECIPESCOMPLEX}&addRecipeInformation=true&apiKey=${API_KEY}&number=100`;
        if (name) {
            title= req.query.name.toLowerCase().replace(/['"]+/g, '');//Saco las comillas
            whereDb = { title: {[Op.iLike]: `%${title}%`,},};
            queryApi =`${URL_RECIPESCOMPLEX}?query=${title}&addRecipeInformation=true&apiKey=${API_KEY}&number=100`;
        }
        let queryDb = {
            attributes: attrDb,
            where: whereDb,    
            include: includeDb,
        };
            try {
                //Busquemos en la base de datos.. 
                let dbRecipes = await this.model.findAll(queryDb);
                // Ahora, buscamos en la api externa..
                let apiRecipes = axios.get(queryApi);
                Promise.all([dbRecipes, apiRecipes])
                .then((results) => {
                    let [myRecipesResults, apiRecipesResults] = results; 
                    let myRecipesEndResults = myRecipesResults.map((recipe) => {//acomodamos los resultados de la base de datos
                        let { id, title, summary, image, instructions, healthScore ,DietTypes} = recipe;
                        return { id, title, summary, image, instructions, healthScore ,
                            diets: DietTypes? DietTypes.map((diet) => diet.name): []};
                     });
                     let apiRecipesEndResults = apiRecipesResults.data.results;                  
                     apiRecipesEndResults = apiRecipesEndResults.map((e)=> {//acomodamos los resultados de la api externa
                         return {id: e.id, title: e.title, image: e.image, summary: e.summary, 
                            healthScore: parseInt(e.healthScore),
                            instructions: e.analyzedInstructions[0]?.steps.map(e => {return {
                                    number: e.number,
                                    step: e.step
                                }}),
                            diets: e.diets,
                         }
                     })
                     const response = myRecipesEndResults.concat(apiRecipesEndResults);
                    res.status(200).send(response);
                }).catch((error) => {
                    console.log('linea 61',error);
                    res.status(500).send(error);
                }
                );
            } catch (error) {
                console.log('linea 66',error);
                res.status(500).send(error);
            }        
        // }
        // else{
        //     res.status(404).json({
        //         message: "Not exist a 'query=name'- on URL.",
        //     })
        // }
    };  

    getByIdParams = async (req, res, next) => {
        let details;
        let pk = req.params.idReceta;
        // DB Id
        if(pk){
            if(pk.length > 9) {
                try{
                    details = await this.model.findOne({
                        where: { id: pk,},
                        include: [{ model: DietType, attributes: ['id','name']}],  
                    })
                }catch (error) {console.log("error buscando db",error.pk)}
                if(details){
                    let { DietTypes} = details;
                    let diets = DietTypes? DietTypes.map((diet) => diet.name): [];   
                    details = 
                      { title: details.title, 
                        summary: details.summary, 
                        image: details.image,
                        instructions: details.instructions,
                        healthScore: details.healthScore, 
                        diets,};
                    return res.json({
                        message: "Your database detail recipe",
                        data: details,
                    })
                }
                else{console.log("no details");
                    res.status(404).json({
                        message: "Not exist a this id recipes in the Database",
                    })
                }
            }
            // API Id
            else{let apiIdDetail;
                try{
                apiIdDetail = await axios.get(`${URL_RECIPEID}/${pk}/information?apiKey=${API_KEY}`);
                }
                catch (error) {console.log("error buscando api",error.id)}
                if(apiIdDetail) {
                    details = {
                        image: apiIdDetail.data.image,
                        title: apiIdDetail.data.title,
                        dishTypes: apiIdDetail.data.dishTypes,
                        diets: apiIdDetail.data.diets,
                        summary: apiIdDetail.data.summary,
                        healthScore: apiIdDetail.data.healthScore,
                        instructions: apiIdDetail.data.analyzedInstructions[0]?.steps.map(e => {
                            return {
                                number: e.number,
                                step: e.step
                            }
                        })
                    };
                }   
                if(details){
                    return res.json({
                        message: "Your api detail recipe",
                        data: details,
                    })
                }
                else{console.log("no details API");
                    res.status(404).json({
                        message: "Not exist a this id recipes in the API",
                    })
                }
            } 
        }
        else{console.log("else sin params");
            res.status(404).json({
                message: "Not exist a 'req.params' in the URL.",
            })
        };
    };

    post = async(req, res, next) => {
        let { title, summary, healthScore, instructions, diets, image } = req.body;
    
        if(req.body.title){
            let recipe = await this.model.create({
                title,
                summary,
                healthScore,
                instructions,
                diets,
                image,
                id: uuidv4(),
            });
             const diet = await DietType.findAll({where:( {name: diets})});
             recipe.addDietType(diet);
            res.status(200).json({
                message: "The recipe has been created",
                data: recipe
            }); 
        }
        else{
            res.status(404).json({message: 'Not recipe title found'})
        }
    }
    addTypeToRecipe = async (req, res, next) =>{
        const { recipeId, typeId } = req.params;
        const diet = await DietType.findByPk(typeId);
        console.log(diet);
        const recipe = await Recipe.findByPk(recipeId);
        console.log(recipe)
        const recipeDiet = await recipe_dietType.create({
            RecipeId: recipe.id,
            DietTypeId: diet.id
        })
        res.send(recipeDiet);
    }
}
const recipesController = new RecipeModel(Recipe);
module.exports = recipesController;