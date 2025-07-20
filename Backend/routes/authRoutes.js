const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, authorizeRoles } = require('../middlerware/authMiddleware');
const multer = require('multer');
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage });

router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/admin/login', authController.adminLogin);

router.get('/profile', protect, authController.getUserProfile);
router.put('/profile', protect, upload.single('profileImage'), authController.updateUserProfile);
router.delete('/profile', protect, authController.deleteUserAccount);
router.put('/profile/password', protect, authController.changeUserPassword);
router.post('/forgot-password', protect, authController.forgotPassword);


router.get('/admin/stats', protect, authorizeRoles('admin'), authController.getAdminStats);

router.get('/admin/users', protect, authorizeRoles('admin'), authController.getAllUsers);
router.get('/admin/users/:id', protect, authorizeRoles('admin'), authController.getUserById);
router.put('/admin/users/:id', protect, authorizeRoles('admin'), authController.updateUserById);
router.delete('/admin/users/:id', protect, authorizeRoles('admin'), authController.deleteUserById);

router.put('/admin/users/:id/role', protect, authorizeRoles('admin'), authController.updateUserRole);
router.post('/admin/users/:id/roles', protect, authorizeRoles('admin'), authController.assignUserRole);
router.get('/admin/users/:id/roles', protect, authorizeRoles('admin'), authController.getUserRoles);

router.put('/admin/users/:id/reset-password', protect, authorizeRoles('admin'), authController.resetUserPassword);
router.put('/admin/users/:id/verify-email', protect, authorizeRoles('admin'), authController.verifyUserEmail);
router.post('/admin/users/:id/resend-verification', protect, authorizeRoles('admin'), authController.resendVerificationEmail);

router.put('/admin/users/:id/lock', protect, authorizeRoles('admin'), authController.lockUserAccount);
router.put('/admin/users/:id/unlock', protect, authorizeRoles('admin'), authController.unlockUserAccount);

router.get('/admin/users/:id/orders', protect, authorizeRoles('admin'), authController.getUserOrders);
router.get('/admin/users/:id/logs', protect, authorizeRoles('admin'), authController.getUserActivityLogs);

router.get('/admin/user-stats', protect, authorizeRoles('admin'), authController.getUserStats);

module.exports = router;