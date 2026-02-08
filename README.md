# Excali Sketch

Excali Sketch is a real-time collaborative canvas application inspired by Excalidraw. Built entirely using a raw canvas library, it features custom shapes and text logic implemented from scratch—no external drawing libraries required.

## Features

- **Real-time Collaboration:** Uses WebSockets with an Express backend to enable seamless multi-user drawing sessions.
- **Custom Shapes & Text:** Implements unique drawing features with custom shapes and text logic for enhanced performance.
- **Modern Tech Stack:** Built with Next.js and managed via Turborepo for efficient monorepo management. The frontend is deployed on Vercel and the backend on Render.
- **Room Management:** Easily create, join, and manage collaborative drawing sessions.

## Demo

- **Live Website:** [Excali-Sketch](https://excali-sketch-frontend.vercel.app)
- **Demo Video:** [Gdrive](https://drive.google.com/file/d/1ofiLr19VXA27T3ZyPH1qwzF64n8AkRGK/view)

## Installation

To run Excali Sketch locally, follow these steps:

1. **Clone the repository:**

  ```bash
git clone https://github.com/shahzan01/Excali-Sketch
cd excali-sketch
   ```


2. **Install dependencies :**

  ```bash
pnpm install
   ```
3. **Set Up Environment Variables**
   Create a `.env` files in the apps/ExcaliSketch and apps/backend directory using the provided `.env.example`.

   ```
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   NEXT_PUBLIC_WS_URL=http://localhost:5000

   ```
   ```
   USER_JWT_SECRET="<Your user JWT Secret>"
   DATABASE_URL=<Your PostgreSQL connection string>

   ```
4. **Run Database Migrations and Generate Prisma Client**
   ```bash
   cd apps/backend && npx prisma migrate dev
   ```

5. **Run the application:**
   ```bash
   cd ../../ && npm run dev
   ```


## Tech Stack

| Component         | Tools & Technologies                         |
|-------------------|----------------------------------------------|
| **Frontend**      | Next.js, React, Turborepo, Vercel              |
| **Backend**       | Express, WebSockets, Render                    |
| **Canvas Logic**  | Custom implementation using raw canvas    |
| **Room Management** | Custom logic                                   |

## Contributing

Contributions are welcome! Please fork the repository and open a pull request for any feature improvements, bug fixes, or documentation enhancements.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any questions or suggestions, feel free to reach out at [m.shahzan2003@gmail.com](mailto:m.shahzan2003@gmail.com).
