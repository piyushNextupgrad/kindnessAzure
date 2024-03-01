import { useState, useEffect } from "react";
import StripePay from "../../stripe_pay";
import showNotification from "@/helpers/show_notification";
const Modal = ({
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
  setDonorName,
  setDonorEmail,
  setDonorPhone,
  setDonorAddress,
  setDonorGiftNote,
  setamt,
  setDonationMessage,
  setAmountFromCheckbox,
  setCustomAmount,
  handleClear,
}) => {
  function closeModal() {
    console.log("Worked");
    settoggle(false);
    setamt(null);
    setDonorGiftNote("");
    setDonorAddress("");
    setDonorPhone("");
    setDonorEmail("");
    setDonorName("");
    setDonationMessage("");
    setAmountFromCheckbox(0);
    setCustomAmount(0);
    handleClear();
    showNotification("Your Payment is successfull", "Success");
  }

  function terminateModal() {
    console.log("Worked");
    settoggle(false);
    setamt(null);
    setDonorGiftNote("");
    setDonorAddress("");
    setDonorPhone("");
    setDonorEmail("");
    setDonorName("");
    setDonationMessage("");
    setAmountFromCheckbox(0);
    setCustomAmount(0);
    handleClear();
  }

  return (
    <>
      {toggle && (
        <div
          className="modal fade show "
          tabIndex="-1"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-scrollable modal-lg modal-sm model ">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5"></h1>
              </div>
              <div className="modal-body customBody">
                <form>
                  <>
                    <div className="mb-3">
                      <span className="Label">Name </span>
                      <span>{donorName}</span>
                    </div>
                    <div className="mb-3">
                      <span className="Label">Email </span>
                      <span>{donorEmail}</span>
                    </div>

                    <div className="mb-3">
                      <span className="Label">Phone </span>
                      <span>{donorPhone}</span>
                    </div>
                    <div className="mb-3">
                      <span className="Label">Address </span>
                      <span>{donorAddress}</span>
                    </div>
                    <div className="mb-3">
                      <span className="Label">Gift Note </span>
                      <span>{donorGiftNote}</span>
                    </div>
                    <div className="mb-3">
                      <span className="Label">Amount </span>
                      <span>{amt}</span>
                    </div>
                  </>

                  <StripePay
                    amt={amt}
                    donationMessage={donationMessage}
                    customAmount={customAmount}
                    amountFromCheckbox={amountFromCheckbox}
                    donorName={donorName}
                    donorEmail={donorEmail}
                    donorPhone={donorPhone}
                    donorAddress={donorAddress}
                    donorGiftNote={donorGiftNote}
                    toggle={toggle}
                    settoggle={settoggle}
                    closeModal={closeModal}
                  />
                </form>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={terminateModal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toggle && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default Modal;
