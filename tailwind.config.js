/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#001169',
        'navy-light': '#0053CF',
        white: {
          DEFAULT: '#ffffff',
          5: '#ffffff0d',
          10: '#ffffff1a',
          15: '#ffffff26',
          20: '#ffffff33',
          30: '#ffffff4d',
          40: '#ffffff66',
          50: '#ffffff80',
          60: '#ffffff99',
          70: '#ffffffb3',
          80: '#ffffffcc',
          90: '#ffffffe6',
        },
        gray: {
          light: '#d3d3d3',
          'light-80': '#f7f7f7cc',
        },
        black: '#000000',
      },
      boxShadow: {
        modal: '0 0 30px 0 rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        modal: '25px',
      },
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
        lineseed: ['LINE Seed Sans KR', 'sans-serif'],
        sans: [
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
