import React from "react";
import "./Pricing.css"; // ✅ Make sure Pricing.css is in the same folder as this file

const Pricing = () => {
  return (
    <div className="pricing-container">
      <h1 className="pricing-title">Choose Your ThinkFlix Plan</h1>
      <div className="pricing-grid">
        <div className="plan-card">
          <h2>Free</h2>
          <p className="price">$0/month</p>
          <ul>
            <li>1 course upload/month</li>
            <li>Max 3 episodes</li>
            <li>Audio only</li>
          </ul>
          <button className="subscribe-btn">Start Free</button>
        </div>

        <div className="plan-card highlighted">
          <h2>Basic</h2>
          <p className="price">$5/month</p>
          <ul>
            <li>2 uploads/month</li>
            <li>Up to 20 episodes</li>
            <li>Audio + visuals</li>
            <li>2 style packs</li>
          </ul>
          <button className="subscribe-btn">Subscribe</button>
        </div>

        <div className="plan-card">
          <h2>Pro</h2>
          <p className="price">$15/month</p>
          <ul>
            <li>10 uploads/month</li>
            <li>Full animated shows</li>
            <li>All styles included</li>
            <li>Priority access</li>
          </ul>
          <button className="subscribe-btn">Upgrade</button>
        </div>
      </div>

      <p className="school-note">
        Are you a school? <a href="/contact">Contact us</a> for institutional plans.
      </p>
    </div>
  );
};

export default Pricing;
