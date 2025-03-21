import { createRouter, createWebHistory } from 'vue-router';

// Import the components used in your routes
import IntroSection from '@/components/IntroSection.vue';
import SocialProof from '@/components/SocialProof.vue';
import FeaturesPage from '@/components/FeaturesPage.vue';
import ProcessInt from '@/components/ServiceSection.vue';
import BlogPost from '@/components/BlogPost.vue';
import ContactUs from '@/components/ContactUs.vue';
import Project from '@/components/ProjectSection.vue';
import AboutUs from '@/components/AboutUs.vue';
import Service from '@/components/ServiceSection.vue';
import DetailedBlog1 from '@/components/detailedblogpage/DetailedBlog1.vue';


const routes = [
  { path: '/intro', name: 'Intro', component: IntroSection },
  { path: '/social-proof', name: 'SocialProof', component: SocialProof },
  { path: '/features', name: 'FeaturesPage', component: FeaturesPage },
  { path: '/process', name: 'ProcessInt', component: ProcessInt },
  { path: '/blog', name: 'BlogPost', component: BlogPost },
  { path: '/contact', name: 'ContactUs', component: ContactUs },
  { path: '/project', name: 'Project', component: Project },
  { path: '/about-us', name: 'AboutUs', component: AboutUs },
  { path: '/service', name: 'Service', component: Service },
  {
    path: '/detailed-blog-1',
    name: 'DetailedBlog1',
    component: DetailedBlog1,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      };
    }
    return { x: 0, y: 0 };
  },
});

export default router;