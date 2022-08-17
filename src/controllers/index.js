const { v4: uuidv4 } = require('uuid');
                // CRUD for DB
class ModelCrud {
    constructor(model) { 
        this.model = model;
    };       
    getAll = (req, res, next) => { // GET all records
        console.log("GET all records");
        return this.model.findAll()
            .then(results => res.send(results))
            .catch((err) => next(err));
    };

    getByIdParams = (req, res, next) => { // Get by id params
        console.log("getByIdParams");
        const id = req.params.id;
        return this.model.findByPk(id)
            .then((result) => res.send(result))
            .catch((err) => next(err));
    };

    delete = (req, res, next) => {  // Delete by req.body.id
        const id = req.body.id;
        return this.model.destroy({
            where: {
                id
            }
        })
        .then(() => res.sendStatus(200))
        .catch((err) => next(err));
    };

    post = (req, res, next) => { // Create by req.body
        console.log(" post");
        const body = req.body;
        return this.model.create({
            ...body, 
            id: uuidv4()
        })
        .then(() => res.send())
        .catch((err) => next(err));
    }
}
module.exports = ModelCrud;