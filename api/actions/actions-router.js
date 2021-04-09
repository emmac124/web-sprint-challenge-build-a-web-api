const express = require('express')

const Actions = require("./actions-model")
const mw = require("./../middleware/middlewares")

const router = express.Router()

//   - `[GET] /api/actions` returns an array of actions (or an empty array) as the body of the _response_.
router.get("/", (req,res) => {
    Actions.get()
        .then(actions => {
            res.status(200).json(actions)
        })
        .catch(err => {
            res.status(500).json({message: "could not fetch actions"})
        })
})

//   - `[GET] /api/actions/:id` returns an action with the given `id` as the body of the _response_.
router.get("/:id", mw.validateActionId, (req,res) => {
    res.status(200).json(req.actionId)
})

//   - `[POST] /api/actions` returns the newly created action as the body of the _response_.
router.post("/", mw.validateAction, (req,res) => {
        Actions.insert(req.body)
            .then(action => {
                res.status(201).json(action)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })  
})

//   - `[PUT] /api/actions/:id` returns the updated action as the body of the _response_.
router.put("/:id", mw.validateActionId, mw.validateAction, async (req, res) => {
    const { id } = req.params
    const changes = req.body
    try {
        const updatedAction = await Actions.update(id, changes)
        if(!updatedAction){
            res.status(404).json({message: "action could not be updated"})
        } else {
            res.status(200).json(updatedAction)
        }
    } catch(err){
        res.status(500).json(err.message)
    }
})

//   - `[DELETE] /api/actions/:id` returns no _response_ body.
router.delete("/:id", mw.validateActionId, async (req,res) => {
    try{
        const { id } = req.params
        const deletedAction = await Actions.remove(id)
        if(!deletedAction){
            res.status(404).json({message: "The user with the specified id does not exist"})
        } else {
            res.status(201).json(deletedAction)
        }
    } catch(err){
        res.status(500).json(err.message)
    }
})

module.exports = router