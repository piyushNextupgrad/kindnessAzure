import moment from "moment";
export const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

export const randomKey = () => {
  var maxNumber = 999999999;
  var randomNumber = Math.floor(Math.random() * maxNumber + 1);
  return randomNumber;
};

export const emailValidation = (email) => {
  const regex =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (!email || regex.test(email) === false) {
    return false;
  }
  return true;
};

export const getFormatedDate = (date, format = "") => {
  if (format != "") {
    return moment(date).format(format);
  }

  if (typeof date?.getMonth === "function") {
    return moment(date).format("L");
  }

  if (date == undefined) {
    return moment().format("L");
  }

  if (typeof date === "string") {
    return moment(date).format("L");
  }
};

export const extractRecordFromObject = (dataObject, indexfrom, indexto) => {
  const sliced = Object.fromEntries(
    Object.entries(dataObject).slice(indexfrom, indexto)
  );

  return sliced;
};

export const mobileRegex = (param) => {
  let pattern = /^([\+0]91)?\-?[5-9]{1}[0-9]{9}$/g;
  let validated = new RegExp(pattern).test(param);
  let message = validated ? "" : "Enter Valid Mobile No.";
  return { success: validated, message };
};

export const checkIsNumber = (data) => {
  const regex = new RegExp("^[0-9]*$");
  return regex.test(data);
};

export function checkImageOrVideoFromUrl(dataurl) {
  if (dataurl) {
    const allowedExtensionsImage = [
      "jpg",
      "jpeg",
      "png",
      "gif",
      "webp",
      "tiff",
      "bmp",
      "tiff",
      "bmp",
      "jfif",
    ];
    const allowedExtensionsVideo = [
      "mp4",
      "webm",
      "mov",
      "avi",
      "wmv",
      "mkv",
      "flv",
      "Ff4v",
      "swf",
      "mpeg",
      "mpg",
    ];
    const extension = dataurl.split(".").pop();

    let imageEx = allowedExtensionsImage.includes(extension);
    let videoEx = allowedExtensionsVideo.includes(extension);

    if (imageEx) {
      return "image";
    } else if (videoEx) {
      return "video";
    } else {
      return "video";
    }
  } else {
    return null;
  }
}

// export const getFileType = (fileType) => {
//   switch (fileType) {
//     case "video/mp4":
//       return "video";
//       break;
//     case "video/x-flv":
//       return "video";
//       break;
//     case "video/mp2t":
//       return "video";
//       break;
//     case "video/webm":
//       return "video";
//       break;
//     case "video/x-msvideo":
//       return "video";
//       break;
//     case "video/x-matroska":
//       return "video";
//       break;
//     case "video/x-ms-wmv":
//       return "video";
//       break;
//     case "video/ogg":
//       return "video";
//       break;
//     case "video/quicktime":
//       return "video";
//       break;
//     case "image/gif":
//       return "image";
//       break;
//     case "image/jpg":
//       return "image";
//       break;
//     case "image/jpeg":
//       return "image";
//       break;
//     case "image/png":
//       return "image";
//       break;
//     default:
//       return false;
//   }
// };

export const isURL = (str) => {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
      "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
      "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
};

export const getFileType = (fileType) => {
  switch (fileType) {
    // Video formats
    case "video/mp4":
    case "video/x-flv":
    case "video/mp2t":
    case "video/webm":
    case "video/x-msvideo":
    case "video/x-matroska":
    case "video/x-ms-wmv":
    case "video/ogg":
    case "video/quicktime":
    case "video/3gpp": // Added
    case "video/3gpp2": // Added
    case "video/avif": // Added
    case "video/jpeg": // Added
    case "video/jpm": // Added
    case "video/mj2": // Added
    case "video/mp2t": // Added
    case "video/mp4": // Added
    case "video/mpeg": // Added
    case "video/ogg": // Added
    case "video/quicktime": // Added
    case "video/webm": // Added
    case "video/avi": // Added
    case "video/x-msvideo": // This is the MIME type for AVI
      return "video";

    // Image formats
    case "image/gif":
    case "image/jpg":
    case "image/jpeg":
    case "image/png":
    case "image/bmp": // Added
    case "image/cgm": // Added
    case "image/g3fax": // Added
    case "image/ief": // Added
    case "image/ktx": // Added
    case "image/svg+xml": // Added
    case "image/tiff": // Added
      return "image";

    default:
      return false;
  }
};

export function convertTo12HourFormat(timeIn24Hour) {
  const hours = Math.floor(timeIn24Hour / 3600);
  const minutes = Math.floor((timeIn24Hour % 3600) / 60);
  const period = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  const formattedTime = `${formattedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")} ${period}`;

  return formattedTime;
}

export const addToGoogleCalendar = (title, location, sDate, Desc) => {
  const startTime = new Date(sDate).toISOString();

  // You can set a default duration, for example, 1 hour.
  const endTime = new Date(
    new Date(sDate).getTime() + 60 * 60 * 1000
  ).toISOString();

  const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${Desc}&location=${location}`;

  window.open(googleCalendarUrl);
};
