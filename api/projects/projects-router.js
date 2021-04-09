const express = require("express")

const Projects = require("./projects-model")
const mw = require("./../middleware/middlewares")

const router = express.Router()

//   - `[GET] /api/projects` returns an array of projects (or an empty array) as the body of the response.
router.get("/", (req,res) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json({message: "could not fetch all projects"})
        })
})

//   - `[GET] /api/projects/:id` returns a project with the given `id` as the body of the _response_.
router.get("/:id", mw.validateProjectsId, (req,res) => {
    res.status(200).json(req.projectId)
})

//   - `[POST] /api/projects` returns the newly created project as the body of the _response_.
router.post("/", mw.validateProject, (req,res) => {
    Projects.insert(req.body)
        .then(project => {
            res.status(200).json(project)
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
})

//   - `[PUT] /api/projects/:id` returns the updated project as the body of the _response_.
router.put("/:id", mw.validateProjectsId, mw.validateProject, async (req,res) => {
    const { id } = req.params
    const changes = req.body
    try {
        const updatedProject = await Projects.update(id, changes)
        if(!updatedProject){
            res.status(404).json({message: "project could not be updated"})
        } else {
            res.status(200).json(updatedProject)
        }
    } catch(err){
        res.status(500).json(err.message)
    }
})

//   - `[DELETE] /api/projects/:id` returns no _response_ body.
router.delete("/:id", mw.validateProjectsId, async (req,res) => {
    try {
        const { id } = req.params
        const deletedProject = await Projects.remove(id)
        if(!deletedProject){
            res.status(404).json({message: "the project with the specified id does not exist"})
        } else {
            res.status(201).json(deletedProject)
        }
    } catch(err){
        res.status(500).json(err.message)
    }
})

//   - `[GET] /api/projects/:id/actions` sends an array of actions (or an empty array) as the body of the response.
router.get("/:id/actions", (req,res) => {
    const projectsId = {...req.body, project_id: req.params.id}
    Projects.getProjectActions(projectsId)
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
})

module.exports = router
