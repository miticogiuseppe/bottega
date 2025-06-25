
import ReviewsAlignmentCard from "../../@spk-reusable-components/reusable-pages/reviews/reviewsalignmentcard";
import ReviewSlidescard from "../../@spk-reusable-components/reusable-pages/reviews/reviewstyle3";
import ReviewStyle5Card from "../../@spk-reusable-components/reusable-pages/reviews/reviewstyle5";
import ReviewCard from "../../@spk-reusable-components/reusable-pages/reviews/reviewstyles2";
import Reviewstyle1Card from "../../@spk-reusable-components/reusable-pages/reviews/spkreviewstyle1";

//**   Reviews Style 1 : Start ***//
const testimonials = [
    {
        name: "Hadley Kylin",
        role: "UX Guru",
        image: "../../assets/images/faces/1.jpg",
        content: "This product is amazing! It has made my daily tasks so much easier and is very user-friendly.",
        views: 65,
        stars: 4.5,
        Navigate: "#!"
    },
    {
        name: "Spencer Robin",
        role: "Support Engineer",
        image: "../../assets/images/faces/13.jpg",
        content: "Helping me plan for my future. Their expertise and personalized approach have great.",
        views: 87,
        stars: 4.5,
        Navigate: "#!"
    },
    {
        name: "Iliana Lilly",
        role: "Optima Works",
        image: "../../assets/images/faces/3.jpg",
        content: "A game-changer for our business. Their insights and strategic advice helped us streamline.",
        views: 47,
        stars: 4.5,
        Navigate: "#!"
    },
    {
        name: "Tommy Rosen",
        role: "Freelance Dev",
        image: "../../assets/images/faces/14.jpg",
        content: "Incredibly knowledgeable and supportive throughout the entire process. They provided clear.",
        views: 87,
        stars: 4.5,
        Navigate: "#!"
    },
    {
        name: "Jasmine Della",
        role: "Web Oneness",
        image: "../../assets/images/faces/5.jpg",
        content: "This blender exceeded my expectations. It’s powerful, easy to clean, and makes perfect.",
        views: 87,
        stars: 4.5,
        Navigate: "#!"
    },
    {
        name: "Samson Thomas",
        role: "Cloud Architect",
        image: "../../assets/images/faces/14.jpg",
        content: "Cloud architect designed a scalable and efficient cloud infrastructure for us perfect.",
        views: 87,
        stars: 4.5,
        Navigate: "#!"
    }
];
export const Reviewstyle1data = testimonials.map((testimonial, index) => (
    <div key={index}>
        <Reviewstyle1Card testimonial={testimonial} />
    </div>
))
//**   Reviews Style 1 : End ***//

//**   Reviews Style 2 : Start ***//
const testimonials1 = [
    {
        name: "Flora Mary",
        role: "Systems Analyst",
        image: "../../assets/images/faces/1.jpg",
        content: "Technical issues quickly and efficiently resolved. Their expertise and prompt service have been critical in keeping our operations smoothly.",
        rating: 4.5,
        bgClass: "bg-secondary-transparent"
    },
    {
        name: "Maria Violet",
        role: "Web Developer",
        image: "../../assets/images/faces/6.jpg",
        content: "Web developer did an outstanding job creating our new website. It's user-friendly, visually appealing, and has all the functionality we need.",
        rating: 4.5,
        bgClass: "bg-primary-transparent"
    },
    {
        name: "John Smith",
        role: "Systems Analyst",
        image: "../../assets/images/faces/13.jpg",
        content: "Freelance writer delivered high-quality content that perfectly captured our brand voice. They were professional, met all deadlines.",
        rating: 4.3,
        bgClass: "bg-primary1-transparent"
    },
    {
        name: "Uma Renata",
        role: "Systems Analyst",
        image: "../../assets/images/faces/10.jpg",
        content: "Template has an excellent theme and functionality. The quality is great, and I love that I can download content to make customization!",
        rating: 4.3,
        bgClass: "bg-primary3-transparent"
    },
    {
        name: "Arjun Richel",
        role: "Systems Analyst",
        image: "../../assets/images/faces/15.jpg",
        content: "This product is amazing! It has made my daily tasks so much easier and is very user-friendly. The product life is impressive too.",
        rating: 4.1,
        bgClass: "bg-success-transparent"
    },
    {
        name: "Flora Mary",
        role: "Data Analyst",
        image: "../../assets/images/faces/6.jpg",
        content: "The checkout process was smooth, and my order arrived on time and well-packaged. Very satisfied with my purchase.",
        rating: 3.8,
        bgClass: "bg-warning-transparent"
    }
];
export const ReviewsStyledata = testimonials1.map((testimonial, index) => (
    <div key={index}>
        <ReviewCard testimonial={testimonial} />
    </div>
))

//**   Reviews Style 2 : End ***//

//**   Reviews Style 3 : Start ***//
const reviews = [
    {
        name: "Elsa Teresa",
        email: "elsateresa@gmail.com",
        imgSrc: "../../assets/images/faces/8.jpg",
        rating: 4.3,
        Navigate: "#!"
    },
    {
        name: "Henry Milo",
        email: "henrymilo@gmail.com",
        imgSrc: "../../assets/images/faces/9.jpg",
        rating: 4.3,
        Navigate: "#!"
    },
    {
        name: "Katherin Oslo",
        email: "katherinoslo212@gmail.com",
        imgSrc: "../../assets/images/faces/6.jpg",
        rating: 4.3,
        Navigate: "#!"
    },
    {
        name: "Jestin Calm",
        email: "jestincalm1999@gmail.com",
        imgSrc: "../../assets/images/faces/14.jpg",
        rating: 4.3,
        Navigate: "#!"
    },
    {
        name: "Harin Ford",
        email: "harinford345@gmail.com",
        imgSrc: "../../assets/images/faces/13.jpg",
        rating: 4.3,
        Navigate: "#!"
    },
    {
        quote: "Customer service at this company is outstanding. They were quick to respond to my inquiry and resolved my issue within hours.",
        name: "Phillip John",
        email: "phillipjohn21@gmail.com",
        imgSrc: "../../assets/images/faces/11.jpg",
        rating: 4.3,
        Navigate: "#!"
    },
];

export const ReviewSlides = reviews.map((review, index) => (
    <div key={index}>
        <ReviewSlidescard review={review} />
    </div>
))

//**   Reviews Style 3 : End ***//

//**   Reviews Style 4 : Start ***//
const reviews4 = [
    {
        name: "Victoria Red",
        imgSrc: "../../assets/images/faces/1.jpg",
        quote: "Project to success with excellent planning and coordination. Their leadership and communication kept everything on track and within budget.",
        rating: 4.5
    },
    {
        name: "Nicolas Noor",
        imgSrc: "../../assets/images/faces/12.jpg",
        quote: "Cybersecurity specialist has been crucial in protecting our data. Their proactive measures and quick response to threats give us of mind.",
        rating: 4.5
    },
    {
        name: "Remi Gloria",
        imgSrc: "../../assets/images/faces/3.jpg",
        quote: "Marketing consultant provided us with a clear, actionable strategy that boosted our online presence and increased customer engagement.",
        rating: 4.5
    },
    {
        name: "Danny Raj",
        imgSrc: "../../assets/images/faces/14.jpg",
        quote: "The cloud architect designed a scalable and efficient cloud infrastructure for us. Their expertise has greatly improved our data accessibility.",
        rating: 4.5
    },
    {
        name: "Sissera William",
        imgSrc: "../../assets/images/faces/5.jpg",
        quote: "Cybersecurity specialist has been crucial in protecting our data. Their proactive measures and quick response to threats give us great peace of mind.",
        rating: 4.5
    },
    {
        name: "Audie Yose",
        imgSrc: "../../assets/images/faces/6.jpg",
        quote: "Graphic designer created beautiful and impactful designs for our campaign. Their creativity and attention to detail were evident in every piece they delivered.",
        rating: 4.5
    },
];
export const Review4Slides = reviews4.map((review, index) => (
    <div key={index}>
        <ReviewsAlignmentCard review={review} />
    </div>
))

//**   Reviews Style 4 : End ***//


//**   Reviews Style 5 : Start ***//
const reviews5 = [
    {
        name: "Vinny Rose",
        role: "Systems Analyst",
        imgSrc: "../../assets/images/faces/1.jpg",
        quote: "The network administrator has ensured our systems run smoothly and securely, always quick to resolve any issues and keep our network optimized.",
        rating: 4.5
    },
    {
        name: "Amaya Usha",
        role: "Web Developer",
        imgSrc: "../../assets/images/faces/2.jpg",
        quote: "Always reliable and efficient. They resolve technical problems quickly and provide clear, helpful guidance to our staff.",
        rating: 4.5
    },
    {
        name: "Sophia Ben",
        role: "Systems Analyst",
        imgSrc: "../../assets/images/faces/3.jpg",
        quote: "Created a website that exceeded our expectations. It’s visually appealing, user-friendly, and has enhanced our online presence significantly.",
        rating: 4.5
    },
    {
        name: "Sissera William",
        role: "Systems Analyst",
        imgSrc: "../../assets/images/faces/4.jpg",
        quote: "The network administrator has ensured our systems run smoothly and securely, always quick to resolve any issues and keep our network optimized.",
        rating: 4.5
    },
    {
        name: "Georgia Kate",
        role: "Systems Analyst",
        imgSrc: "../../assets/images/faces/5.jpg",
        quote: "The network administrator has ensured our systems run smoothly and securely, always quick to resolve any issues and keep our network optimized.",
        rating: 4.5
    },
];

export const Review5Slides = reviews5.map((review, index) => (
    <div key={index}>
        <ReviewStyle5Card review={review} />
    </div>
))
//**   Reviews Style 5 : End ***//








