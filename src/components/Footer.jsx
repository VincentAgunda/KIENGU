import React from "react";

const Footer = () => {
  return (
    <footer className="bg-blue-600 text-white p-4 mt-auto">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} KIENGU HMS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
