const { Features } = require('../models/features');
const router = require('express').Router();

router.get('/:teamCode', async (req, res) => {
  console.log(req.params.teamCode);
  try {
    const teamFeature = await Features.findOne({
      teamCode: req.params.teamCode,
    });
    if (!teamFeature) {
      await new Features({
        teamCode: req.params.teamCode,
        features: [
          {
            id: 1,
            title: 'Backlog',
            cards: [],
          },
          {
            id: 2,
            title: 'In Progress',
            cards: [],
          },
          {
            id: 3,
            title: 'Completed',
            cards: [],
          },
        ],
      }).save();
      return res.status.send({
        message: 'No features found for this team. Created a new feature list.',
      });
    } else {
      return res.status(200).send({
        message: 'Team features found',
        data: teamFeature.features,
      });
    }
  } catch (error) {}
});

module.exports = router;
