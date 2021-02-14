import Dashboard from "./views/Dashboard.js";


const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};
  
  const navigateTo = url => {
       history.pushState(null, null, url);
       router();
   };
   
   //Creating router
   const router = async () => {
       //Array of paths for the router to direct to, executes code when directed to each
        const routes = [
            { path: "/", view: () => Dashboard}
            //{ path: "/posts", view: () => console.log("Viewing Posts")},
            //{ path: "/settings", view: () => console.log("Viewing Settings")},
        ];

        // test each route for potential match
        const potentialMatches = routes.map(route => {
            return {
                route: route,
                result: location.pathname.match(pathToRegex(route.path))
            };
        });

        let match = potentialMatches.find(potentialMatch => potentialMatch.isMatch);

        if (!match) {
            match = {
                route: routes[0],
                result: [location.pathname]
            };
        }

        const view = new match.route.view(getParams(match));

        document.querySelector("#app").innerHTML = await view.getHtml();

        console.log(match.route.view());
    };

        window.addEventListener("popstate", router);

    document.addEventListener("DOMContentLoaded", () => {
        document.body.addEventListener("click", e =>{
            if (e.target.matches("[data-link]")){
                e.preventDefault();
                navigateTo(e.target.href)
            };
        })
        
        router();
    });