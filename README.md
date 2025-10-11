# Students - Take Home Task

## Requirements

- Python 3
- React
- Typescript

## Run the backend
```bash
$ ./run_server
```

## Develop a frontend

Use React, Typescript, and any frontend libraries and frameworks of your choice to develop a frontend to manage a
database of students. Please use modern React, using functional components and hooks.

The frontend should be styled using the company branding in the included branding guide using CSS, SASS/SCSS, CSS-in-JS,
or (our preferred option) Styled Components. The company logos are included in a variety of colours in SVG format.

The backend endpoints are defined in the included Postman file.

The frontend should be **two pages** defined with different routes using the React Router.

**The first page** should display a grid that can be filtered and sorted. The user must have the ability to add students to the
grid using some kind of form, and update records individually, as well as delete records.

**The second page** should contain a lookup feature for students using their UUID and should display the student information
in a 'card' like UI component (showing the most recent lookup). The 'card' should contain all pieces of stored
information about the student. The most recent lookup should persist between page changes between the 'grid' view and
the 'lookup' view. This should be achieved using React Redux Hooks.
