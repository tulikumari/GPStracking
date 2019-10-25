import Vue from "vue";
import Router from "vue-router";
import controler from "@/components/controler/controler";
import displayer from "@/components/displayer/displayer";
import controller from "@/components/controller/controller";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            name: "controler",
            component: controler
        },
        {
            path: "/controller",
            name: "controller",
            component: controller
        },        
        {
            path: "/controler",
            name: "controler",
            component: controler
        },
        {
            path: "/displayer",
            name: "displayer",
            component: displayer
        },
        {
            path: "*",
            redirect: "/"
        } // catch all use case
    ]
});
