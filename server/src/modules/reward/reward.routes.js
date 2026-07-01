const express = require('express');
const rewardController = require('./reward.controller');
const rewardTransactionController = require('../reward-transaction/rewardTransaction.controller');
const { validateGetReward } = require('./reward.validation');
const { validateGetHistory } = require('../reward-transaction/rewardTransaction.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

const router = express.Router();

router.use(authenticate);

// ─── Reward Routes ────────────────────────────────────────────────
router.get('/me', validateGetReward, rewardController.getMyReward);

// ─── Reward Transaction Routes ────────────────────────────────────
router.get('/history', validateGetHistory, rewardTransactionController.getHistory);

module.exports = router;
