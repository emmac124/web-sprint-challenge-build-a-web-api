const Actions = require("./../actions/actions-model")
const Projects = require("./../projects/projects-model")

const validateActionId = async (req, res, next) => {
    const { id } = req.params
    try {
        const actionId = await Actions.get(id)
        if(!actionId){
            res.status(404).json(`No action with the ID: ${id}`)
        } else {
            req.actionId = actionId
            next()
        }
    } catch(err){
        res.status(500).json(err.message) 
    }
}

const validateAction = (req, res, next) => {
    if(!req.body.description || !req.body.notes || !req.body.project_id){
        res.status(400).json({message: "project id, description and notes required"})
    } else {
        next()
    }
}

const validateProjectsId = async (req, res, next) => {
    const { id } = req.params
    try{
        const projectId = await Projects.get(id)
        if(!projectId){
            res.status(404).json(`No Project with the ID: ${id}`)
        } else {
            req.projectId = projectId
            next()
        }
    } catch(err){
        res.status(500).json(err.message)
    }
}

const validateProject = (req, res, next) => {
    if(!req.body.name || !req.body.description){
        res.status(400).json({message: "missing name and description"})
    } else{
        next()
    }
}

module.exports = {
    validateActionId,
    validateAction,
    validateProjectsId,
    validateProject,
}