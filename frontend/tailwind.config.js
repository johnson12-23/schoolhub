/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#0f6a3d",
          yellow: "#f2c94c",
          cream: "#fffdf4",
          dark: "#123524"
        }
      },
      boxShadow: {
        soft: "0 18px 50px -22px rgba(15, 106, 61, 0.35)"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Nunito", "sans-serif"]
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(circle at top, rgba(242, 201, 76, 0.35), transparent 40%), linear-gradient(135deg, #0f6a3d 0%, #1d8348 100%)"
      }
    }
  },
  plugins: []
};

