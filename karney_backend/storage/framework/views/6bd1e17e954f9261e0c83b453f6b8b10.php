<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css">
<link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <?php echo app('Illuminate\Foundation\Vite')('resources/css/app.css'); ?>
  <script type="text/javascript" src="app.js"></script>
</head>

<body>
  <!-- Header -->
<nav class="mx-auto px-2">
    <div class="flex items-center justify-between">
      <!-- Left side -->
      <div class="flex items-center space-x-10 ml-10">
      <a href="#">
      <img src="./logo2.png" alt="Karney-Logo" width='150'/>
      </a>
        <div class="flex space-x-10 text-slate-700">
          <a href="#Features" class="text-slate-700">Features</a>
          <a href="#Reviews" class="text-slate-700">Reviews</a>
          <a href="#Coming-soon" class="text-slate-700">Pricing</a>
          <a href="#Faqs" class="text-slate-700">FAQs</a>
        </div>
      </div>
      
      <!-- Right side -->
      <div class="hidden md:flex space-x-7 items-center mr-16">
        <button type="submit" class="rounded-md bg-zinc-900 text-white px-3 py-2 text-sm font-bold shadow-sm hover:bg-black">Download</button>
      </div>
    </div> 
  </nav>
  <!-- End-Header -->

  <!-- Interface -->
  <div class="flex flex-col mx-auto">
    <h1 class="text-3xl font-normal tracking-wide leading-loose ml-16 mt-20">Make your life easier with Karney.</h1>
    
    <div class="flex flex-row ml-16 mx-auto">
        <p class="max-w-md font-light">Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum nemo, voluptatibus reprehenderit ab itaque laudantium voluptatum, repellendus maxime excepturi culpa officiis expedita! Eveniet architecto facere consequatur sit necessitatibus perspiciatis ea.</p>
        <div class="hidden md:flex ">
          <img src="./interfacee.png" alt="Picture-One" class=" object-cover -mt-32 ml-60" width='40%'/>
        </div>
      </div>
      <div class="mx-auto flex space-x-6 ml-16 lg:-mt-32 ">
      <a class="playstore-button" href="#">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon" viewBox="0 0 512 512">
    <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
  </svg>
  <span class="texts">
    <span class="text-1">GET IT ON</span>
    <span class="text-2">Google Play</span>
  </span>
</a>
          <a href="./Video_pub.mp4" class="rounded-md bg-white px-3 py-3 text-sm font-normal text-black border border-gray-300 shadow-sm"><button type="submit" ><i class="fa-solid fa-play mr-3"></i>Watch the video</button></a>
        </div>

</div>
  <!-- Interface -->

    <div class="p-5 mt-56 bg-zinc-900 text-white w-full">
        <div class="flex flex-col" id='Features'>
          <h1 class="text-3xl font-normal tracking-wide leading-loose ml-16 mt-16">You can win time. Try it yourself</h1>
          <p class='max-w-2xl font-light ml-16'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores, totam maxime quam voluptas vel sed. Vel numquam magni eius alias ad cum praesentium quam, incidunt ipsam soluta molestiae rem dolor?</p>
        </div>
  <!-- First card  --> 
  <div class="flex sm:flex-col md:flex-row justify-around mt-20">

  <div class="mb-14">
  <div class="">
          <img id="dynamic-image" src='${imageURL}' alt="Picture-One" class=" object-cover -mt-20" width='90%'/>
        </div>
  </div>


  <!-- ////////////////////////////////////////////////////// -->

  <!-- Second card  --> 
  <div class="" >

  <div class="relative flex flex-col text-white rounded-xl">
  <nav class="flex min-w-[240px] flex-col gap-9 p-2 text-lg font-normal text-blue transition-all">
    <div role="button" id='1'
      class="selected flex items-center w-full p-6 leading-tight transition-all rounded-lg outline-none text-start hover:bg-zinc-700 ">
      <div>
        <h6
          class="block text-lg antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
          List of your customers
        </h6>
        <p class="block text-sm antialiased font-light leading-normal text-gray-400 ">
          you can consult all your customers.
        </p>
      </div>
    </div>
    <div role="button" id='2'
      class="flex items-center w-full p-6 leading-tight transition-all rounded-lg outline-none text-start hover:bg-zinc-700 ">
      <div>
        <h6
          class="block text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
          Adding new customers
        </h6>
        <p class="block text-sm antialiased font-normal leading-normal text-gray-400">
          The option of adding new customers to your list.
        </p>
      </div>
    </div>
    <div role="button" id='3'
      class="flex items-center w-full p-6 leading-tight transition-all rounded-lg outline-none text-start hover:bg-zinc-700 ">
      <div>
        <h6
          class="block text-lg antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
          Details of every customer
        </h6>
        <p class="block text-sm antialiased font-normal leading-normal text-gray-400">
          UI/UX Designer @ Material Tailwind
        </p>
      </div>
    </div>
  </nav>
</div>
  </div>
  </div>
</div>
<div class="text-center mt-20">
  <h1 class="text-3xl font-semibold antialiased">Now is the time to move to faster life.</h1>
  <p class="line-clamp-2 text-gray-700 mt-3">
  It takes 30 seconds to sign up. Download the app and create an account today <br/>
  and we’ll send you a tip guaranteed to double your first investment.


  </p>

  <div class="mt-10">
  <a class="playstore-button" href="#">
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="icon" viewBox="0 0 512 512">
    <path d="M99.617 8.057a50.191 50.191 0 00-38.815-6.713l230.932 230.933 74.846-74.846L99.617 8.057zM32.139 20.116c-6.441 8.563-10.148 19.077-10.148 30.199v411.358c0 11.123 3.708 21.636 10.148 30.199l235.877-235.877L32.139 20.116zM464.261 212.087l-67.266-37.637-81.544 81.544 81.548 81.548 67.273-37.64c16.117-9.03 25.738-25.442 25.738-43.908s-9.621-34.877-25.749-43.907zM291.733 279.711L60.815 510.629c3.786.891 7.639 1.371 11.492 1.371a50.275 50.275 0 0027.31-8.07l266.965-149.372-74.849-74.847z"></path>
  </svg>
  <span class="texts">
    <span class="text-1">GET IT ON</span>
    <span class="text-2">Google Play</span>
  </span>
</a>
  </div>
</div>

<div class="flex items-center justify-center my-10">
<form action="<?php echo e(route('comments.store')); ?>" method="POST" class="w-full max-w-md">
  <?php echo csrf_field(); ?>
        <div class="flex flex-col items-center">
            <input type="text" name="full_name" id="full_name" class="w-96 h-12 px-5 rounded-lg mb-2 text-sm text-gray-900 bg-white border-0 dark:bg-zinc-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Your name" required >
            <div class="w-96 mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-zinc-700 dark:border-zinc-600">
                <div class="px-4 py-2 bg-white rounded-t-lg dark:bg-zinc-800">
                    <textarea id="comment" name='description' rows="4" class="w-full px-0 text-sm text-gray-900 bg-white border-0 dark:bg-zinc-800 focus:ring-0 dark:text-white dark:placeholder-gray-400" placeholder="Write a comment..." required></textarea>
                </div>
                <div class="flex items-center justify-between px-3 py-2 border-t dark:border-zinc-600"  id='Reviews'>
                    <button type="submit" class="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                        Post comment
                    </button>
                </div>
            </div>
            <p class="text-xs text-gray-500 dark:text-gray-400">Remember, contributions to this topic should follow our <a href="#" class="text-blue-600 dark:text-blue-500 hover:underline">Community Guidelines</a>.</p>
        </div>
    </form>
</div>


<!-- Carousel cards -->
        <?php
          $ConditionsComments = $comments->shuffle();
        ?>
        <?php if($ConditionsComments->isEmpty()): ?>
          <p class='text-center m-10'>No comments available.</p>
        <?php else: ?>
        <div class="flex items-center justify-center mt-20" >
    <div class="carousel-container w-full max-w-5xl mx-auto fade">
        <!-- Carousel Column 1 -->
        <div class="carousel-column p-10">
        <?php
          $shuffledComments = $comments->shuffle();
        ?>
            <div class="carousel-track" style="animation-duration: 15s;">
                <?php $__currentLoopData = $shuffledComments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $comment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="carousel-card">
                    <div class="card-title font-semibold text-lg first-letter:uppercase mb-5">
                        <?php echo e($comment->full_name); ?>

                    </div>
                    <div class="card-description font-normal text-sm space-x-4">
                        <?php echo e($comment->description); ?>

                    </div>
                </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </div>
        <!-- Carousel Column 2 -->
        <div class="carousel-column p-10">
            <div class="carousel-track" style="animation-duration: 25s;">
                <?php $__currentLoopData = $comments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $comment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="carousel-card">
                    <div class="card-title font-semibold text-lg first-letter:uppercase mb-5">
                        <?php echo e($comment->full_name); ?>

                    </div>
                    <div class="card-description font-normal text-sm space-x-4">
                        <?php echo e($comment->description); ?>

                    </div>
                </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </div>
        <!-- Carousel Column 3 -->
        <div class="carousel-column p-10">
            <div class="carousel-track" style="animation-duration: 15s;">
                <?php $__currentLoopData = $shuffledComments; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $comment): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <div class="carousel-card">
                    <div class="card-title font-semibold text-lg first-letter:uppercase mb-5">
                        <?php echo e($comment->full_name); ?>

                    </div>
                    <div class="card-description font-normal text-sm space-x-4">
                        <?php echo e($comment->description); ?>

                    </div>
                </div>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </div>
        </div>
    </div>
</div>
        <?php endif; ?>


<!-- faq -->
<section class="bg-zinc-900 text-gray-100 py-32">
  <div class="container flex flex-col justify-center p-4 mx-auto md:p-8">
    <h2 class="mb-12 text-4xl font-bold text-center sm:text-5xl" id='Faqs'>Frequently Asked Questions</h2>
    <div class="flex flex-col divide-y sm:px-8 lg:px-12 xl:px-32 divide-gray-700">
      <details>
        <summary class="py-2 outline-none cursor-pointer">How can I place an order?</summary>
        <div class="px-4 pb-4">
          <p>You can easily place an order on our website by browsing our product catalog, selecting the items you want, and adding them to your cart. Then, proceed to checkout, where you can provide your shipping and payment information to complete the order.</p>
        </div>
      </details>
      <details>
        <summary class="py-2 outline-none cursor-pointer">What payment methods do you accept?</summary>
        <div class="px-4 pb-4">
          <p>We accept various payment methods, including credit cards, debit cards, net banking, and mobile wallet payments. You can choose the payment option that is most convenient for you during the checkout process.</p>
        </div>
      </details>
      <details>
        <summary class="py-2 outline-none cursor-pointer">How long does shipping take?</summary>
        <div class="px-4 pb-4">
          <p>Shipping times may vary depending on your location and the shipping method chosen. Typically, orders are processed within 1-2 business days, and delivery can take 3-7 business days within India. You will receive a tracking notification once your order is shipped.</p>
        </div>
      </details>
      <details>
        <summary class="py-2 outline-none cursor-pointer">Can I return a product if I'm not satisfied?</summary>
        <div class="px-4 pb-4">
          <p>Yes, we have a hassle-free return policy. If you are not satisfied with your purchase, you can initiate a return within 30 days of receiving the product. Please contact our customer support at <a href="" class="underline">example@gmail.com</a> for assistance.</p>
        </div>
      </details>
      <details>
        <summary class="py-2 outline-none cursor-pointer">Do you offer international shipping?</summary>
        <div class="px-4 pb-4">
          <p>Currently, we only provide shipping services within India. However, we may consider expanding our shipping options to international locations in the future. Please stay updated with our website for any changes in shipping destinations.</p>
        </div>
      </details>
      <details>
        <summary class="py-2 outline-none cursor-pointer">What is your customer support contact?</summary>
        <div class="px-4 pb-4">
          <p>If you have any questions, concerns, or need assistance, you can reach our customer support team at 9911083755 during our business hours, Monday to Saturday from 10 am to 6 pm. You can also contact us via email at <a href="" class="underline">example@gmail.com</a>.</p>
        </div>
      </details>
      <details>
        <summary class="py-2 outline-none cursor-pointer">What are your terms and conditions?</summary>
        <div class="px-4 pb-4">
          <p>You can find our detailed terms and conditions by visiting our 
            <a href="" class="underline">Terms of Service</a> 
            page on our website. It includes information about our policies, user guidelines, and more.</p>
        </div>
      </details>
    </div>
  </div>
</section>
<!-- About me (card) -->
<!-- 
<div class="flex items-center justify-center">
<div class="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-zinc-800 dark:border-gray-700 my-12 p-8">
    <div class="flex flex-col items-center p-10">
        <img class="w-24 h-24 mb-3 rounded-full shadow-lg" src="./me.jpeg" alt="Bounouar"/>
        <h5 class="mb-1 text-xl font-medium text-gray-900 dark:text-white">Bounouar Mohammed</h5>
        <span class="text-sm text-gray-500 dark:text-gray-400">Web & Mobile developer</span>
        <div class="flex mt-4 md:mt-6">
            <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Hire Me</a>
            <a href="#" class="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Message</a>
        </div>
    </div>
</div>
</div> -->

<footer class="bg-white shadow dark:bg-zinc-900 ">
    <div class="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div class="sm:flex sm:items-center sm:justify-between">
            <a href="" class="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
                <!-- <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" /> -->
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Karney</span>
            </a>
            <ul class="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
                <li>
                    <a href="#" class="hover:underline me-4 md:me-6">About</a>
                </li>
                <li>
                    <a href="#" class="hover:underline me-4 md:me-6">Privacy Policy</a>
                </li>
                <li>
                    <a href="#" class="hover:underline me-4 md:me-6">Licensing</a>
                </li>
                <li>
                    <a href="#" class="hover:underline">Contact</a>
                </li>
            </ul>
        </div>
        <hr class="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span class="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="#" class="hover:underline">Karney™</a>. All Rights Reserved.</span>
    </div>
</footer>



</body>
</html><?php /**PATH C:\xampp\htdocs\Karney-App\karney_backend\resources\views/welcome.blade.php ENDPATH**/ ?>