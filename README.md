# Sacha Tours — Website

Native HTML, CSS and JavaScript site with **Serbian**, **Italian** and **French** language support. Colors are based on the French flag (blue, white, red).

## Pages

- **Landing** (`index.html`) — Hero, custom itinerary note, testimonials, image grid, guide section
- **Tours** (`tours.html`) — Card list of tours (image, short description, price); click opens **Tour detail** (`tour-detail.html?id=...`) with details, price and image gallery (click image for lightbox)
- **Household** (`household.html`) — Description, what’s offered, image gallery, Facebook & Instagram links
- **Contact** (`contact.html`) — Phone, email, address; guide links (FB, LinkedIn, Instagram); household links (FB, Instagram)

## Content and images

All copy and image paths are driven by **data/content.json**. See **data/README.md** for the JSON structure. Replace placeholder text and paths with your real content and add your images under **images/** (and **images/tours/** for tour photos).

## Run locally

Serve **this folder** over HTTP so `data/content.json` and links work. Run the server **from inside the project directory**:

```bash
cd sacha-web
python3 -m http.server 8000
```

Then open **`http://localhost:8000`** (not `http://localhost:8000/sacha-web/`).

If you start the server from the parent directory (e.g. `llama`), then open `http://localhost:8000/sacha-web/`. A 404 on `/sacha-web/` usually means the server was started from inside `sacha-web`—use `http://localhost:8000` in that case.

## Language

Use the **SR** / **IT** / **FR** buttons in the header. The chosen language is stored in `localStorage` and reused on the next visit.
