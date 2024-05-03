<template>
    <nav class="nav-bar">
      <div class="navbar-brand">FINBUD</div>
      <ul class="nav-items">
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Services</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'NavBar',
  };
  </script>
  
  <style scoped>
  .nav-bar {
    background-color: #007bff;
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 2rem;
  }
  
  .navbar-brand {
    font-size: 1.8rem;
    font-weight: bold;
    cursor: pointer;
  }
  
  .nav-items {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
  }
  
  .nav-items li a {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    transition: background-color 0.3s ease;
  }
  
  .nav-items li a:hover {
    background-color: #0056b3;
    border-radius: 5px;
  }
  </style>
  