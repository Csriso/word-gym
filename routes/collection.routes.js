const router = require("express").Router();
const { render } = require("express/lib/response");
const WordSetModel = require("../models/Wordset.model")

router.get("/", async (req, res, next)=>{
    try{
         const wordSets = await WordSetModel.find().populate("words")
         res.render("wordset/allsets.hbs", {wordSets})
    }catch(err){
        console.log(err)
    }
    
})


module.exports = router;