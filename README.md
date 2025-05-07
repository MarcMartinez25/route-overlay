# Running Route Overlay

A web application that allows you to overlay your running route from a GPX file onto any background image. Perfect for creating custom running route visualizations!

## Features

- Upload GPX files to extract route data
- Upload background images
- Drag and resize the route overlay
- Export the final image with the route overlay
- Simple and intuitive interface
- FIT file support coming soon!

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

1. Upload your GPX file using the "Upload GPS File" button
2. Upload a background image using the "Upload Background Image" button
3. Once both files are uploaded, you'll see your route overlaid on the background image
4. Click and drag the route overlay to position it
5. Use the mouse wheel to resize the route overlay
6. Click "Export Image" to save your creation

## Technical Details

- Built with Next.js and TypeScript
- Uses Tailwind CSS for styling
- Client-side processing of GPX files
- Canvas-based route rendering
- No server-side processing required

## Contributing

Feel free to open issues or submit pull requests if you have suggestions for improvements!

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
