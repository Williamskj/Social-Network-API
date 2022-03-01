const router = require('express').Router();
const { User } = require('../../models')


router.get('/', (req, res) => {
    User.find()
        .then((users) => res.json(users))
        .catch((err) => res.status(500).json(err))
})

router.post('/', (req, res) => {
    User.create(req.body)
        .then((userData) => {
            res.json(userData)
        })
        .catch((err) => res.status(500).json(err))
})


router.get('/:userId', (req, res) => {
    User.findOne({_id: req.params.userId})
        .select('-__v')
        .populate('thoughts')
        .populate('friends')
        .then((user) => !user ? res.status(404).json({ message: 'No user with given ID found' }) : res.json(user))
        .catch((err) => res.status(500).json(err))
})


router.put('/:userId', (req, res) => {
    User.findByIdAndUpdate(req.params.userId,
        {
            $set: {
                username: req.body.username, 
                email: req.body.email
            }
        }
    )
    .then((user) => 
        !user ? res.status(404).json({ message: 'No user with given ID found' }) : res.json(user) 
    )
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    })
})

router.delete('/:userId', (req, res) => {
    User.deleteOne({_id: req.params.userId})
        .then((user) => 
            !user ? res.status(404).json({ message: 'No user with given ID found' }) : res.json({message: 'Deletion successful'})
    )
    .catch((err) => res.status(500).json(err))
})


router.post('/:userId/friends/', (req, res) => {
    User.create(req.body)
        .then((friend) => {
            return User.findOneAndUpdate(
                {_id: req.params.userId},
                {$addToSet: { friends: friend._id} },
                { new : true }
            )
        })
        .then((user) =>
        !user
          ? res
              .status(404)
              .json({ message: 'No user with given ID found' })
          : res.json('Post created')
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      })
})

router.delete('/:userId/friends/:friendId', (req, res) => {
    User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId }}
    )
        .then((user) => 
            !user ? res.status(404).json({ message: 'No user with given ID found' }) : res.json({message: 'Deletion successful'}) 
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
})
module.exports = router;