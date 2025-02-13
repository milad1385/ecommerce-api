const redis = require("../configs/redis");
const bcrypt = require("bcryptjs");

const getPhoneByPattern = (phone) => {
  return `otp:${phone}`;
};

exports.getOtpDetails = async (phone) => {
  const otp = await redis.get(getPhoneByPattern(phone));

  if (!otp) {
    return {
      expire: true,
      remainingTime: 0,
    };
  }

  const remainingTime = await redis.ttl(getPhoneByPattern(phone));
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return {
    expire: false,
    remainingTime: formattedTime,
  };
};

exports.generateOtp = async (phone, length = 4, expire = 2) => {
  const digites = "0123456789";

  let otp = "";

  for (let i = 0; index < length; i++) {
    otp += digites[Math.random() * digites.length];
  }

  //! Temporary
  otp = "1111";

  const salt = await bcrypt.genSalt(12);

  const hashedOtp = await bcrypt.hash(otp, salt);

  await redis.set(getPhoneByPattern(phone), hashedOtp, "EX", expire * 60);

  return otp;
};
