const { Building } = require("../models/building");

const addNewBuilding = async (req, res, next) => {
  try {
		await Building.create({
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      pic: req.body.pic,
      pic_id: req.body.pic_id
    })
		res.json({ status: 'ok' })
	} catch (err) {
		res.json({ status: 'error', error: 'Duplicate building' })
	}
};

// get a building from their objectID
const getBuildings = async (req, res, next) => {
  try {
    // find the user in the database
    let buildings = await Building.find();
    if (buildings) {
      return res.send({ data: buildings });
    }
    // user not found
    return res.send("no bulding");
  } catch (e) {
    console.error(e);
    return res.send(e);
  }
};

// get a building from their objectID
const getBuildingDetail = async (req, res, next) => {
  try {
    const buildingDetail = await Building.findOne({
      name: req.params.name,
    }).lean();
    return res.send({ name: req.params.name, data: buildingDetail });
  } catch (err) {
    next(err);
  }
};

const editBuilding = async (req, res, next) => {
  try {
    // find the building
    const buildingDetails = await Building.findOne({
      name: req.params.name,
    }).lean();
    // initialise info
    var newDescription = buildingDetails.newDescription;
    var newPic = buildingDetails.newPic;

    // update editable info if found in request
    if (req.body.newDescription) {
      newDescription = req.body.newDescription;
    }
    if (req.body.newPic) {
      newPic = req.body.newPic;
    }

    // update the specified building with new info
    await User.findOneAndUpdate(
      { name: req.body.name },
      { description: newDescription, pic: newPic }
    );
    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
};

const addTag = async (req, res, next) => {
  try {
    // find the building
    const building = await Building.findOne({
      name: req.body.name,
    }).lean();

    if (req.body.newTag && building) {
      building.tags.push(req.body.newTag);
      building.save();
      return res.send(building);
    }

    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
};

const removeTag = async (req, res, next) => {
  try {
    // find the building
    const building = await Building.findOne({
      name: req.body.name,
    }).lean();

    if (building.tags.includes(req.body.removeTag)) {
      for (var tag in building.tags) {
        foundTag = building.tags[tag];
        if (foundTag.toString() == req.body.removeTag.toString()) {
          building.tags[tag].splice(tag, 1);
        }
      }
    }

    res.json({ status: "ok" });
  } catch (err) {
    next(err);
  }
};

const rateBuilding = async (req, res, next) => {
  let user = req.body.ratedByID;
  let value = req.body.ratingValue;
  let newRating = {"ratedByID": user, "ratingValue": value};
  var total = 0;
  var newAverageRating = 0;


  try{
    const buildingFound = await Building.findOne( {name: req.body.name} )
    if (buildingFound){
      var removeIndex;
      
      for (var rating in buildingFound.ratings){
        if (user == buildingFound.ratings[rating].ratedByID){
          removeIndex = rating;
        }
      }

      if(removeIndex){
        buildingFound.ratings.splice(removeIndex,1);
      } 

      buildingFound.ratings.push(newRating);
      for (var rating in buildingFound.ratings){
        total  = buildingFound.ratings[rating].ratingValue + total;
      }

      newAverageRating = total / buildingFound.ratings.length;
      buildingFound.averageRating = newAverageRating;
      
      buildingFound.save();
      return res.send(buildingFound);
    
    } else {
      return res.send("building does not exist");
    }
    

  } catch (err){
      next(err)
  }
}

module.exports = {
  addNewBuilding,
  getBuildings,
  getBuildingDetail,
  editBuilding,
  removeTag,
  addTag,
  rateBuilding
};