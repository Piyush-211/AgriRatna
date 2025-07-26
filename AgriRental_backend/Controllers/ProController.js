const EquipModel = require("../Models/Equipments");
const UserModel = require("../Models/User");
const BookModel = require("../Models/Booking");


const addEqipment = async (req, res) => {
  try {
    const { type, name, pricePerDay,location, Lender } = req.body;
    const image = req.file?.filename;

    const newEquip = new EquipModel({ type, name, pricePerDay, location,Lender, image });

    await newEquip.save();

    res.status(201).json({
      message: "Equipment added successfully",
      success: true,
    });
  } catch (err) {
    console.error(err); // Log actual error to debug
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

const getAllEquipments = async (req, res) => {
  try {
    const equipments = await EquipModel.find()
      .sort({ createdAt: -1 });    // Newest first (if you have timestamps)

    // const user = await UserModel.findById()

    res.status(200).json({
      success: true,
      data: equipments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch equipments",
    });
  }
};

const BookEqipment = async (req, res) => {
  try {
    const { equipId,userId,lenderId } = req.body;
    

     const newBooking = new BookModel({
      BID: userId,       // buyer (person booking)
      EquipId: equipId,  // equipment being booked
      LID: lenderId      // lender (equipment owner)
    });

    await newBooking.save();

    res.status(201).json({
      message: "Equipment booked successfully",
      success: true,
    });
  } catch (err) {
    console.error(err); // Log actual error to debug
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
const myEquipments = async (req, res) => {
  try {
    const lenderId = req.user._id;
    const booking = await EquipModel.find({Lender:lenderId})
      .sort({ createdAt: -1 });    // Newest first (if you have timestamps)

    // const user = await UserModel.findById()

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch my Equipments",
    });
  }
};

const myBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await BookModel.find({ BID: userId });

    const detailedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const equipment = await EquipModel.findById(booking.EquipId);
        const lender = await UserModel.findById(booking.LID);
        return {
          equipment,
          lender,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: detailedBookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch My bookings",
    });
  }
};

const myLending = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await BookModel.find({ LID: userId });

    const detailedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const equipment = await EquipModel.findById(booking.EquipId);
        const borrower = await UserModel.findById(booking.BID);
        return {
          equipment,
          borrower,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: detailedBookings,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch My bookings",
    });
  }
};

const profile = async (req, res) => {
  try {
    const userId = req.user._id;
    const data = await UserModel.findById(userId);

    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch My Profile",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, contact, location } = req.body;

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { name, contact, location },
      { new: true }
    ).select('-password');

    res.status(200).json({ success: true, data: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};



module.exports = {
   addEqipment,
   getAllEquipments,
   BookEqipment,
   myEquipments,
   myBookings,
   myLending,
   profile,
   updateProfile
}