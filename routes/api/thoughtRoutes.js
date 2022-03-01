const router = require('express').Router();
const { User, Thought } = require('../../models');

router.get('/', (req, res) => {
    Thought.find()
        .then((Thought) => res.json(Thought))
        .catch((err) => res.status(500).json(err))
})

router.post('/', (req, res) => {
    Thought.create(req.body)
        .then((thought) => {
            return User.findOneAndUpdate(
                { username: req.body.username },
                { $addToSet: { thoughts: thought._id } },
                { new: true }
            )
        })
        .then((user) => {
            !user
                ? res
                    .status(404)
                    .json({ message: 'No user with given ID found' })
                : res.json('Thought created')
        })
        .catch((err) => res.status(500).json(err))
})

router.get('/:thoughtId', (req, res) => {
    Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .populate('reactions')
        .then((thought) => !thought ? res.status(404).json({ message: 'No thought with given ID found' }) : res.json(thought))
        .catch((err) => res.status(500).json(err))
})

router.put('/:thoughtId', (req, res) => {
    Thought.findByIdAndUpdate(req.params.thoughtId,
        {
            $set: {
                thoughtText: req.body.thoughtText,
            }
        }
    )
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'No thought with given ID found' }) : res.json(thought)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
})

router.delete('/:thoughtId', (req, res) => {
    Thought.deleteOne({ _id: req.params.thoughtId })
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'No thought with given ID found' }) : res.json({ message: 'Deletion successful' })
        )
        .catch((err) => res.status(500).json(err))
})

router.post('/:thoughtId/reactions', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { new: true }
    )
        .then((thought) =>
            !thought
                ? res
                    .status(404)
                    .json({ message: 'No thought with given ID found' })
                : res.json('Reaction created')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
})

router.delete('/:thoughtId/reactions/:reactionId', (req, res) => {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } }
    )
        .then((thought) =>
            !thought ? res.status(404).json({ message: 'No thought with given ID found' }) : res.json(thought.reactions)
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        })
})

module.exports = router;