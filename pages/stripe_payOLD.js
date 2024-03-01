import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Spinner } from "react-bootstrap";
import { getInvolvePageSevices } from "@/store/services/getInvolvedPageService";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import showNotification from "@/helpers/show_notification";

const CheckoutForm = ({
  amt,
  donorName,
  donationMessage,
  donorEmail,
  donorPhone,
  donorAddress,
  donorGiftNote,
  closeModal,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState(null);

  const [loader, setLoader] = useState(false);

  const handleSubmit = async (event) => {
    setLoader(true);
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const paymentMethodResult = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (paymentMethodResult.error) {
      setErrorMessage(paymentMethodResult.error.message);
      setLoader(false);
      return;
    }

    // Create or confirm the payment intent on the server

    let params = {
      paymentMethodId: paymentMethodResult.paymentMethod.id,
      paymentAmount: amt,
      //returnUrl: "https://kindness-omega.vercel.app", // Specify your frontend return URL here
      returnUrl: "http://3.142.144.214:3000/", // Specify your frontend return URL here
    };

    const response = await getInvolvePageSevices.orderPay(params);

    const clientSecret = response?.data.clientSecret;
    const { error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      { payment_method: paymentMethodResult.paymentMethod.id }
    );

    if (confirmError) {
      setLoader(false);
      setErrorMessage(confirmError?.message);
    } else {
      try {
        // send data to backend after successful payment
        const formData = new FormData();
        formData.append("donorName", donorName);
        formData.append("donationMessage", donationMessage);
        formData.append("amt", amt);
        formData.append("donorEmail", donorEmail);
        formData.append("donorPhone", donorPhone);
        formData.append("donorAddress", donorAddress);
        formData.append("donorGiftNote", donorGiftNote);

        const response = await getInvolvePageSevices.doPayment(formData);

        console.log("res response", response);

        if (response?.data?.success) {
          closeModal();
          // showNotification("Your Payment is successfull", "Success");
        }

        /* else{
          showNotification("Your Payment is successfull! But not tracked in our system So please payment details", "Error");
        } */

        setLoader(false);
      } catch (error) {
        setLoader(false);
        console.log(error);
      }
      setLoader(false);
    }
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <CardElement />
      {loader ? (
        <div className="overlay">
          <div className="spinner-container">
            <Spinner
              className="loaderSpinnerPiyush"
              style={{
                width: "100px",
                height: "100px",
                color: "#0a1c51fc",
              }}
              animation="border"
            />
          </div>
        </div>
      ) : (
        <button
          className="payBtn"
          onClick={handleSubmit}
          type="button"
          disabled={!stripe || !elements}
        >
          Pay Now
        </button>
      )}

      {errorMessage && <div>{errorMessage}</div>}
    </form>
  );
};

/* const stripePromise = loadStripe(
  "pk_live_51NWr6bKALw1Ok2lyX9i6ej8x7GtWJayseuSkE79V39hhwH3DqK0kh7wCIgIQVYiLOcZtcaTF9KaKrs2DROeBYvaa00C9QMmuup"
); */

const stripePromise = loadStripe(
  "pk_test_51NWr6bKALw1Ok2lyu5DdWiW3Su6Y4ndMpcokUhJLtmx42SBoBXFFskkmXulM8USUi6sYqlhsxA5BEgcHuztj2AjW005fXouJif"
);

const StripePay = ({
  amt,
  donorName,
  donationMessage,
  customAmount,
  amountFromCheckbox,
  donorEmail,
  donorPhone,
  donorAddress,
  donorGiftNote,
  toggle,
  settoggle,
  closeModal,
}) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm
      amt={amt}
      donationMessage={donationMessage}
      customAmount={customAmount}
      amountFromCheckbox={amountFromCheckbox}
      donorName={donorName}
      donorEmail={donorEmail}
      donorPhone={donorPhone}
      donorAddress={donorAddress}
      donorGiftNote={donorGiftNote}
      closeModal={closeModal}
    />
  </Elements>
);

export default StripePay;
