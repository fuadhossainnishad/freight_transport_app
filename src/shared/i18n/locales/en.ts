/**
 * Locale resources as a TypeScript module — deliberately NOT .json.
 *
 * Metro served stale cached JSON modules while happily picking up .ts edits in
 * this same folder, so any newly added key rendered as a raw key on device until
 * a --reset-cache. That cost several debugging rounds. Keeping locales as .ts
 * puts them on the module path that reliably reloads.
 *
 * DO NOT convert these back to .json.
 *
 * en.ts is the source of truth for the key shape (see i18n.d.ts); fr.ts must
 * mirror it exactly — __tests__/i18n.test.ts enforces that.
 */
export default {
  "common": {
    "ok": "OK",
    "cancel": "Cancel",
    "save": "Save",
    "submit": "Submit",
    "send": "Send",
    "close": "Close",
    "retry": "Retry",
    "error": "Error",
    "success": "Success",
    "successExclaim": "Success!",
    "done": "Done",
    "edit": "Edit",
    "delete": "Delete",
    "loading": "Loading...",
    "sending": "Sending...",
    "submitting": "Submitting...",
    "somethingWentWrong": "Something went wrong",
    "tryAgain": "Something went wrong. Please try again.",
    "or": " or ",
    "months": {
      "january": "January",
      "february": "February",
      "march": "March",
      "april": "April",
      "may": "May",
      "june": "June",
      "july": "July",
      "august": "August",
      "september": "September",
      "october": "October",
      "november": "November",
      "december": "December"
    }
  },
  "language": {
    "title": "Language",
    "english": "English",
    "french": "Français",
    "systemDefault": "Use device language"
  },
  "nav": {
    "tabs": {
      "home": "Home",
      "shipments": "Shipments",
      "invoices": "Invoices",
      "payments": "Payments",
      "settings": "Settings",
      "bids": "Bids",
      "earning": "Earning"
    }
  },
  "validation": {
    "emailRequired": "Email is required",
    "emailInvalid": "Enter a valid email address",
    "passwordRequired": "Password is required",
    "newPasswordRequired": "New password is required",
    "passwordMinLength": "Password must be at least {{min}} characters",
    "confirmPasswordRequired": "Please confirm your password",
    "passwordsDoNotMatch": "Passwords do not match",
    "amountRequired": "Amount is required",
    "amountInvalid": "Enter a valid amount",
    "regionRequired": "Please select a region",
    "acceptTermsRequired": "You must accept the general terms and conditions",
    "validationError": "Validation Error",
    "nameRequired": "Name is required",
    "nameInvalid": "Enter a valid name",
    "phoneRequired": "Phone number required",
    "currentPasswordRequired": "Current Password is required",
    "newPasswordRequiredShort": "New Password is required",
    "confirmedPasswordRequired": "Confirmed Password required",
    "accountNumberRequired": "Account number is required",
    "routingNumberRequired": "Routing number is required",
    "bankNameRequired": "Bank name is required",
    "holderNameRequired": "Holder name is required",
    "bankAddressRequired": "Bank address is required"
  },
  "components": {
    "countrySelect": {
      "title": "Select country",
      "search": "Search"
    },
    "truckTypeSelect": {
      "placeholder": "Select truck type",
      "title": "Truck type"
    },
    "locationPicker": {
      "searchPlaceholder": "Search {{label}}",
      "tapMap": "Tap the map to drop a pin",
      "confirm": "Confirm Location",
      "unavailableTitle": "Location unavailable",
      "unavailableMessage": "Could not get your current location. Search or tap the map to pick instead.",
      "pinned": "Pinned location",
      "noneSelected": "No location selected yet"
    },
    "uploadField": {
      "pickFailed": "Failed to pick files",
      "upload": "Upload Image"
    },
    "statCard": {
      "thisMonth": "This Month"
    },
    "datePicker": {
      "placeholder": "Select a date"
    },
    "calendar": {
      "title": "Select date"
    },
    "countryPicker": {
      "placeholder": "Select country"
    },
    "dropdown": {
      "placeholder": "Select"
    },
    "bidCard": {
      "fallbackTitle": "Shipment"
    },
    "searchInput": {
      "placeholder": "Search..."
    },
    "docsPreview": {
      "title": "Document"
    }
  },
  "truckTypes": {
    "tractorhead": "Tractorhead",
    "truck": "Truck",
    "lightCommercialVehicle": "Light commercial vehicle",
    "constructionEquipment": "Construction equipment",
    "semiTrailer": "Semi-trailer",
    "trailer": "Trailer"
  },
  "auth": {
    "roles": {
      "shipperTitle": "I'm a shipper",
      "shipperTagline": "I need to ship goods",
      "transporterTitle": "I'm a Transporter",
      "transporterTagline": "I have trucks to offer"
    },
    "login": {
      "title": "Login to Account",
      "subtitle": "Please enter your email and password to continue",
      "emailLabel": "Email address",
      "emailPlaceholder": "Email address",
      "passwordLabel": "Password",
      "passwordPlaceholder": "Password",
      "rememberPassword": "Remember Password",
      "forgotPassword": "Forgot Password?",
      "signIn": "Sign In",
      "noAccount": "Don't have an account?",
      "signUp": "Sign Up",
      "failedTitle": "Login Failed"
    },
    "signup": {
      "title": "Create Account",
      "subtitle": "Join thousands of businesses and transporters",
      "basicInformation": "Basic information",
      "companyNameLabel": "Company name",
      "companyNamePlaceholder": "Enter company name",
      "emailLabel": "Email address",
      "emailPlaceholder": "Your email address",
      "phoneLabel": "Phone number",
      "countryLabel": "Country",
      "numberOfTrucksLabel": "Number of trucks",
      "numberOfTrucksPlaceholder": "Number of trucks",
      "truckTypeLabel": "Truck type",
      "truckTypePlaceholder": "Select truck type",
      "passwordLabel": "Password",
      "passwordPlaceholder": "Minimum 6 characters",
      "confirmPasswordLabel": "Confirm Password",
      "confirmPasswordPlaceholder": "Re-enter your password",
      "acceptTerms": "I have read and I accept the general terms and conditions",
      "servicePolicy": "I understood that Lawapan Truck is a service dedicated to professionals",
      "create": "Create",
      "haveAccount": "Already have an account? ",
      "logIn": "Log In",
      "accountCreated": "Account created successfully",
      "failedTitle": "Signup Failed",
      "invalidPhoneTitle": "Invalid phone number",
      "invalidPhoneMessage": "A {{country}} phone number must be {{lengths}} digits."
    },
    "forgotPassword": {
      "title": "Forgot Password",
      "subtitle": "Please enter your email address to\nreceive a verification code.",
      "emailPlaceholder": "you@example.com",
      "send": "Send",
      "rememberPassword": "Remember your password?",
      "logIn": "Log In",
      "otpFailed": "Failed to send OTP"
    },
    "verifyOtp": {
      "title": "Verify Your Email",
      "subtitle": "Please enter the {{length}} digit code sent to",
      "noCode": "Didn't receive the code? ",
      "resendIn": "Resend in {{seconds}}s",
      "resendCode": "Resend code",
      "verify": "Verify",
      "failedTitle": "Verification Failed",
      "invalidOtp": "Invalid OTP",
      "verificationFailed": "OTP verification failed",
      "codeSentTitle": "Code sent",
      "codeSentMessage": "A new verification code has been sent to {{email}}.",
      "resendFailed": "Failed to resend code"
    },
    "resetPassword": {
      "title": "Create New Password",
      "subtitle": "Your new password must be different\nfrom previously used passwords.",
      "newPasswordLabel": "New Password",
      "newPasswordPlaceholder": "Enter new password",
      "confirmPasswordLabel": "Confirm Password",
      "confirmPasswordPlaceholder": "Re-enter new password",
      "save": "Save",
      "successMessage": "Password reset successfully",
      "failedTitle": "Reset Failed"
    }
  },
  "settings": {
    "title": "Settings",
    "logOut": "Log Out",
    "logout": {
      "title": "Logout",
      "message": "Are you sure you want to log out?",
      "confirm": "Logout"
    },
    "menu": {
      "editProfile": "Edit Profile Details",
      "changePassword": "Change Password",
      "myVehicles": "My Vehicles",
      "myDrivers": "My Drivers",
      "earningOverview": "Earning Overview",
      "bankDetails": "Bank Details",
      "issueReported": "Issue Reported",
      "about": "About Us",
      "privacy": "Privacy & Security",
      "terms": "Terms & Conditions",
      "hiring": "{{brand}} is Hiring",
      "carrierData": "Your Carrier Data",
      "faq": "FAQ"
    },
    "info": {
      "empty": "No information available"
    },
    "profile": {
      "title": "Edit Profile",
      "nameLabel": "User Name",
      "namePlaceholder": "Enter name",
      "emailLabel": "Email",
      "emailPlaceholder": "Enter email",
      "phoneLabel": "Contact No",
      "phonePlaceholder": "Enter phone",
      "save": "Save & Change",
      "updated": "Profile updated successfully",
      "updateFailed": "Failed to update profile",
      "loadFailed": "Failed to load profile"
    },
    "changePassword": {
      "currentLabel": "Current Password",
      "currentPlaceholder": "Enter Current Password",
      "newLabel": "New Password",
      "newPlaceholder": "Enter New Password",
      "confirmLabel": "Confirmed Password",
      "confirmPlaceholder": "Enter Confirmed Password",
      "changeFailed": "Failed to change password"
    },
    "bank": {
      "title": "Bank Details",
      "accountDetails": "Account Details",
      "accountNumbered": "Account {{number}}",
      "addAccount": "Add Account",
      "saveChange": "Save & Change",
      "accountNumberLabel": "Account Number",
      "accountNumberPlaceholder": "Enter your account number",
      "routingNumberLabel": "Routing Number",
      "routingNumberPlaceholder": "Enter your routing number",
      "bankNameLabel": "Bank Name",
      "bankNamePlaceholder": "Enter bank name",
      "holderNameLabel": "Bank holder Name",
      "holderNamePlaceholder": "Enter bank holder name",
      "addressLabel": "Bank Adress",
      "addressPlaceholder": "Enter bank address",
      "added": "Bank details added successfully!",
      "updated": "Bank details updated successfully!",
      "deleteTitle": "Delete account",
      "deleteMessage": "Remove this bank account?",
      "deleteFailed": "Failed to delete"
    },
    "issues": {
      "title": "Issue Reported",
      "summaryTitle": "Issue Summary",
      "searchPlaceholder": "Search issue",
      "deleteTitle": "Confirm Delete",
      "deleteMessage": "Delete this issue?",
      "deleteFailed": "Failed to delete issue",
      "missingShipper": "We couldn't find your shipper profile on this session. Please sign out and sign in again.",
      "loadError": "Something went wrong while loading issues. Please try again.",
      "loadFailed": "Failed to load issue",
      "loadingIssue": "Loading issue...",
      "resolved": "Resolved",
      "pending": "Pending",
      "issueTitle": "Issue Title",
      "shipmentId": "Shipment ID",
      "transporterName": "Transporter Name",
      "reportedOn": "Reported On",
      "description": "Issue Description",
      "table": {
        "shipmentTitle": "Shipment Title",
        "status": "Status",
        "actions": "Actions",
        "empty": "No issues found"
      }
    },
    "faq": {
      "title": "FAQ",
      "loadFailed": "Failed to load FAQs",
      "defaults": {
        "q1": "How do I create a shipment?",
        "a1": "Go to the shipment section and click create shipment. Fill the details and submit.",
        "q2": "How do I track my shipment?",
        "a2": "You can track your shipment from the shipment history screen.",
        "q3": "How do I contact support?",
        "a3": "You can report an issue from the settings page."
      }
    }
  },
  "shipment": {
    "categories": {
      "furniture": "Furniture",
      "electronics": "Electronics",
      "food": "Food",
      "clothing": "Clothing",
      "constructionMaterials": "Construction Materials"
    },
    "packaging": {
      "woodenCrates": "Wooden Crates",
      "pallets": "Pallets",
      "boxes": "Boxes",
      "drums": "Drums",
      "looseCargo": "Loose Cargo"
    }
  },
  "shipper": {
    "home": {
      "createShipment": "Create Shipment",
      "shipmentsInProgress": "Shipments In Progress",
      "completedShipments": "Completed Shipments",
      "totalMoneySpent": "Total Money spent",
      "liveBids": "Live Bids",
      "seeAll": "See All",
      "noBidsTitle": "No live bids yet",
      "noBidsSubtitle": "Post a shipment and transporters will start placing bids here."
    },
    "bids": {
      "title": "Bids",
      "remove": "Remove",
      "open": "Open",
      "empty": "No active bids right now"
    },
    "create": {
      "title": "Create Shipment",
      "stepDetails": "Shipment Details",
      "stepLocation": "Location & Delivery",
      "back": "Back",
      "next": "Next",
      "publish": "Publish Shipment",
      "publishing": "Publishing…",
      "missingTitle": "Missing details",
      "missingMessage": "Please fill in all the delivery details before publishing.",
      "failed": "Shipment creation failed. Please try again.",
      "successTitle": "Shipment created!",
      "successMessage": "Your shipment has been created. An admin will manually review it, and once approved it will be available for bidding."
    },
    "basicInfo": {
      "intro": "Tell us what you're shipping.",
      "titleLabel": "Shipment title",
      "titlePlaceholder": "Ship 12 Pallets of Rice",
      "categoryLabel": "Category *",
      "categoryPlaceholder": "Select category",
      "descriptionLabel": "Description",
      "descriptionPlaceholder": "Describe the goods, handling notes, etc.",
      "weightLabel": "Weight",
      "packagingLabel": "Packaging *",
      "packagingPlaceholder": "Select",
      "dimensionsLabel": "Dimensions (optional)",
      "imagesLabel": "Shipment images (optional)",
      "tapToUpload": "Tap to upload images",
      "imageFormats": "JPG, PNG supported",
      "add": "Add"
    },
    "delivery": {
      "intro": "Where should it be picked up and dropped off?",
      "pickupLabel": "Pickup Location",
      "pickupPlaceholder": "Search pickup address",
      "timeWindowLabel": "Time Window",
      "timeWindowPlaceholder": "e.g. 9:00 AM - 5:00 PM",
      "deliveryLabel": "Delivery Location",
      "deliveryPlaceholder": "Search delivery address",
      "contactLabel": "Contact Person / Phone",
      "contactPlaceholder": "e.g. +1 555 123 4567",
      "dateLabel": "Date Preference",
      "additionalServices": "Additional services",
      "insurance": "Insurance",
      "forwarding": "Forwarding"
    },
    "status": {
      "inProgress": "In progress",
      "inTransit": "In transit",
      "delivered": "Delivered",
      "bidding": "Bidding",
      "pending": "Pending",
      "cancelled": "Cancelled"
    },
    "detail": {
      "title": "Shipment Detail",
      "basicInformation": "Basic Information",
      "shipmentTitle": "Shipment title",
      "category": "Category",
      "description": "Description",
      "weight": "Weight",
      "weightValue": "{{value}} kg",
      "dimensions": "Dimensions (L/W/H)",
      "packaging": "Type of packaging",
      "pickupAndDelivery": "Pickup & Delivery Details",
      "pickupAddress": "Pickup Address",
      "timeWindow": "Time Window",
      "deliveryAddress": "Delivery Address",
      "contactPerson": "Contact Person",
      "datePreference": "Date Preference",
      "amount": "Amount",
      "price": "Price",
      "notFound": "Shipment not found"
    },
    "myShipments": {
      "title": "My Shipments",
      "search": "Search",
      "tableTitle": "Shipment title",
      "tableStatus": "Status",
      "tableAction": "Action",
      "emptyTitle": "No shipments yet",
      "emptySubtitle": "Create your first shipment and transporters will start bidding on it.",
      "noMatchTitle": "No matching shipments",
      "noMatchSubtitle": "We couldn't find a shipment matching \"{{query}}\".",
      "createShipment": "Create Shipment"
    },
    "tracking": {
      "title": "Shipment Tracking",
      "basicInformation": "Basic Information",
      "shipmentId": "Shipment Id",
      "shipmentTitle": "Shipment title",
      "estimatedDelivery": "Estimated Delivery",
      "vehicleDetails": "Vehicle Details",
      "vehicleType": "Vehicle Type",
      "plateNumber": "Plate Number",
      "capacity": "Capacity",
      "capacityValue": "{{value}} Tons",
      "vehicleImages": "Vehicle Images",
      "driverDetails": "Driver Details",
      "driverName": "Name",
      "driverPhone": "Phone",
      "reportIssue": "Report an Issue",
      "confirmDelivery": "Confirm Delivery"
    },
    "addressPicker": {
      "searchPlaceholder": "Search for street, area, or city...",
      "searchFailed": "Unable to search. Please check your internet connection.",
      "addressFailed": "Unable to get address details",
      "noneSelectedTitle": "No Location Selected",
      "noneSelectedMessage": "Please tap on the map or search for a location first.",
      "selectedLocation": "Selected Location",
      "searchWorldwide": "Search for any address worldwide",
      "tapHint": "Tap anywhere on the map\nto select a location",
      "selectedHint": "✓ Location selected!\nTap 'Confirm' below to continue",
      "confirmPickup": "Confirm Pickup Location",
      "confirmDelivery": "Confirm Delivery Location",
      "noResults": "No locations found for \"{{query}}\". Try a different search term."
    }
  },
  "driver": {
    "home": {
      "title": "My Shipments",
      "noShipments": "Your assigned deliveries appear here",
      "activeDeliveries": "{{count}} active delivery",
      "activeDeliveries_plural": "{{count}} active deliveries",
      "loading": "Loading your deliveries…",
      "loadErrorTitle": "Couldn't load shipments",
      "loadFailed": "Failed to fetch shipments",
      "tryAgain": "Try again"
    },
    "empty": {
      "title": "No deliveries yet",
      "subtitle": "When a transporter assigns you a shipment, it shows up here. Pull down to refresh anytime.",
      "refresh": "Refresh",
      "refreshing": "Refreshing…"
    },
    "status": {
      "pending": "Pending",
      "inProgress": "In Progress",
      "inTransit": "In Transit",
      "completed": "Completed",
      "unknown": "Unknown"
    },
    "shipmentDetail": {
      "title": "Shipment Detail",
      "basicInformation": "Basic Information",
      "shipmentTitle": "Shipment Title",
      "category": "Category",
      "description": "Description",
      "weight": "Weight",
      "dimensions": "Dimensions (L/W/H)",
      "packaging": "Type of Packaging",
      "pickupAndDelivery": "Pickup & Delivery",
      "pickupAddress": "Pickup Address",
      "timeWindow": "Time Window",
      "deliveryAddress": "Delivery Address",
      "contactPerson": "Contact Person",
      "amount": "Amount",
      "agreedPrice": "Agreed Price",
      "continueTracking": "Continue Tracking",
      "startShipment": "Start Shipment"
    },
    "tracking": {
      "locationUnavailable": "Location unavailable",
      "pickupLocationMissing": "This shipment's pickup location isn't available yet.",
      "deliveryLocationMissing": "This shipment's delivery location isn't available yet.",
      "routeLoadFailed": "Couldn't load this shipment's route. Please try again.",
      "locationHint": "This shipment is missing precise map coordinates. Please contact support or try again once it's updated.",
      "goBack": "Go Back",
      "reconnecting": "Reconnecting…",
      "almostThere": "Almost there — approaching destination",
      "arrived": "Driver has arrived at destination",
      "headingToPickup": "Heading to pickup",
      "pickup": "Pickup",
      "delivery": "Delivery",
      "dropoff": "Dropoff",
      "driver": "Driver",
      "startRide": "Start Ride",
      "reachedPickup": "You've reached the pickup location",
      "driveToPickup": "Drive to the pickup location — the \"Start Ride\" button will appear when you arrive.",
      "activeRideWarning": "You already have an active delivery (\"{{title}}\") in transit. Finish it before starting this shipment.",
      "activeRideAlertTitle": "Finish your active delivery first",
      "activeRideAlertMessage": "You already have \"{{title}}\" in transit. Complete that delivery before starting this one.",
      "activeRideAlertGeneric": "You already have a shipment in transit. Complete that delivery before starting this one.",
      "anotherShipment": "another shipment",
      "contact": "Contact",
      "timeWindow": "Time Window",
      "covered": "Covered",
      "total": "Total",
      "complete": "complete",
      "inProgress": "in progress",
      "estimatedArrival": "Estimated Arrival",
      "arrivedShort": "Arrived",
      "arrivingSoon": "Arriving soon",
      "arrivalAtDestination": "Arrival at Destination",
      "almostThereHint": "Almost there — the complete button appears when you reach the destination.",
      "driveToDestination": "Drive to the destination — the \"Arrival at Destination\" button will appear when you arrive.",
      "distanceMeters": "{{value}} m",
      "distanceKm": "{{value}} km",
      "distanceUnknown": "? km",
      "proofTitle": "Upload Delivery Proof",
      "proofLabel": "Upload images",
      "proofUpload": "Upload",
      "proofFailedTitle": "Upload failed",
      "proofFailedMessage": "Couldn't submit the delivery proof. Please check your connection and try again."
    },
    "form": {
      "detailsTitle": "Driver Details",
      "detailsSubtitle": "Basic contact information for this driver.",
      "nameLabel": "Driver Name",
      "namePlaceholder": "Enter driver name",
      "phoneLabel": "Phone Number",
      "phoneInvalid": "Enter a valid {{country}} phone number.",
      "phoneInvalidWithDigits": "Enter a valid {{country}} phone number ({{lengths}} digits).",
      "emailLabel": "Email",
      "emailPlaceholder": "Enter email address",
      "countryLabel": "Country",
      "documentsTitle": "Documents",
      "documentsSubtitle": "Add a clear profile photo and the driver's license.",
      "profilePicture": "Profile Picture",
      "driverLicense": "Driver License",
      "removeDriver": "Remove Driver",
      "saveChanges": "Save Changes",
      "addDriver": "Add Driver",
      "saving": "Saving...",
      "adding": "Adding..."
    },
    "list": {
      "title": "My Drivers",
      "unnamed": "Unnamed driver",
      "emptyTitle": "No drivers yet",
      "emptySubtitle": "Add your first driver to start assigning them to shipments.",
      "addDriver": "Add Driver",
      "loadFailed": "Failed to load your drivers. Please try again.",
      "deleteTitle": "Delete driver",
      "deleteMessage": "Are you sure you want to remove this driver?",
      "deleteFailed": "Failed to delete driver."
    },
    "add": {
      "title": "Add Driver",
      "createFailed": "Failed to create driver",
      "successTitle": "Driver Added",
      "successMessage": "The driver has been added successfully and can now be assigned to shipments."
    },
    "update": {
      "title": "Edit Driver Details",
      "loadFailed": "Failed to load driver",
      "updated": "Driver updated successfully",
      "updateFailed": "Update failed"
    },
    "details": {
      "title": "Driver Profile Details",
      "fallbackName": "Driver",
      "nameLabel": "Driver Name",
      "phoneLabel": "Phone Number",
      "emailLabel": "Email",
      "drivingLicense": "Driving License",
      "viewDocument": "View document",
      "remove": "Remove",
      "confirmTitle": "Confirm",
      "confirmMessage": "Are you sure you want to remove this driver?",
      "removed": "Driver removed successfully",
      "removeFailed": "Failed to remove driver"
    },
    "profile": {
      "title": "Profile",
      "sectionTitle": "Profile Detail",
      "nameLabel": "User Name",
      "emailLabel": "Email",
      "phoneLabel": "Contact no",
      "loadFailed": "Couldn't load your profile.",
      "unknownError": "Unknown error",
      "retry": "Tap to retry",
      "logOut": "Log Out",
      "logoutMessage": "Are you sure you want to log out?"
    },
    "preview": {
      "title": "Driving License",
      "loadFailed": "Couldn't load this document."
    },
    "permission": {
      "title": "Allow {{brand}} to access this device's precise location?",
      "precise": "Precise",
      "approximate": "Apprximate",
      "whileUsing": "While using the app",
      "deny": "Don’t allow"
    }
  },
  "invoice": {
    "list": {
      "title": "Invoices",
      "search": "Search invoice",
      "emptyTitle": "No invoices yet",
      "emptySubtitle": "Invoices appear here automatically once your shipments are completed and paid.",
      "loadFailed": "Failed to load invoices",
      "tableTitle": "Shipment Title",
      "tableStatus": "Status",
      "tableActions": "Actions",
      "noMatchTitle": "No matching invoices",
      "noMatchSubtitle": "Try a different shipment title."
    },
    "download": {
      "successTitle": "Downloaded",
      "successMessage": "The invoice was saved to your device.",
      "failedTitle": "Download failed",
      "failedMessage": "Could not save the invoice PDF"
    },
    "status": {
      "paid": "Paid"
    },
    "detail": {
      "title": "Invoice Summary",
      "notFound": "Invoice not found",
      "loadFailed": "Failed to load invoice",
      "unavailable": "Invoice details not available",
      "invoiceNo": "Invoice {{number}}",
      "summarySection": "Invoice Summary",
      "totalAmount": "Total amount",
      "issuedOn": "Issued on",
      "dueDate": "Due Date",
      "paymentMethod": "Payment Method",
      "shipmentSection": "Shipment Information",
      "shipmentId": "Shipment ID",
      "shipmentTitle": "Shipment title",
      "pickupAddress": "Pickup address",
      "deliveryAddress": "Delivery address",
      "weightCategory": "Weight / category",
      "weightValue": "{{value}} kg",
      "dateOfDelivery": "Date of delivery",
      "costBreakdown": "Cost Breakdown",
      "item": "Item",
      "amount": "Amount",
      "transportFee": "Transport Fee",
      "platformFee": "Platform Service Fee",
      "total": "Total",
      "download": "Download invoice"
    }
  },
  "earnings": {
    "title": "Earnings",
    "emptyTitle": "No earnings yet",
    "emptyBody": "Once you complete deliveries, your earnings and withdrawals will appear here.",
    "balance": {
      "label": "Your Balance",
      "withdraw": "Withdraw"
    },
    "table": {
      "date": "Date",
      "amount": "Amount",
      "status": "Status",
      "empty": "No earnings found"
    },
    "withdraw": {
      "title": "Withdraw Request",
      "amountLabel": "Amount",
      "amountPlaceholder": "Enter amount",
      "regionLabel": "Region",
      "regionPlaceholder": "Select region",
      "submitRequest": "Submit Request",
      "requestSubmitted": "Withdraw request submitted"
    }
  }
}
