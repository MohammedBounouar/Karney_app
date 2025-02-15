document.addEventListener("DOMContentLoaded", function() {
  const buttonDivs = document.querySelectorAll('[role="button"]');
  let imageURL = './customers.png'; // Initialize imageURL variable

  buttonDivs.forEach(function(div) {
    div.addEventListener("click", function(event) {
      // Ensure you get the closest ancestor div with the role "button"
      const buttonDiv = event.target.closest('[role="button"]');
      
      // Check if buttonDiv exists
      if (buttonDiv) {
        // Remove the "selected" class from all button divs
        buttonDivs.forEach(function(btn) {
          btn.classList.remove("selected");
        });
        
        // Add the "selected" class to the clicked button div
        buttonDiv.classList.add("selected");

        // Get the ID of the clicked div
        const divId = buttonDiv.id;

        // Set imageURL based on divId
        if (divId === '1') {
          imageURL = './customers.png';
        } else if (divId === '2') {
          imageURL = './add_customers.png';
        }
        else if (divId === '3') {
          imageURL = './customers.png';
        }

        // Log the result (optional)
        console.log('Selected', "Clicked div ID:", divId);
        console.log('Image URL:', imageURL);

        // Update the image src
        const imageElement = document.getElementById('dynamic-image');
        if (imageElement) {
          imageElement.src = imageURL;
        }
      }
    });
  });
});


// Clone the cards for infinite scrolling effect
document.querySelectorAll('.carousel-track').forEach(track => {
  const clones = track.cloneNode(true);
  track.appendChild(clones);
});
