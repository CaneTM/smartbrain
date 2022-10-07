import React, { Component } from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';


const app = new Clarifai.App({
  apiKey: '7a21cd5cbccd4e2fadf9a24f5c2a0903'
});


class App extends Component {

  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      faceBoxes: [],
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({ user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      } 
    })
  }

  // componentDidMount() {
  //   fetch('http://localhost:3000')  // fetch whatever is on this url
  //   .then(response => response.json())  // make fetched response compatible with json
  //   .then(console.log);
  // }

  calculateFaceLocation = (data) => {
    const coords = data;
    const image = document.getElementById('inputImage')
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: coords.left_col * width,
      topRow: coords.top_row * height,
      rightCol: width - (coords.right_col * width),
      bottomRow: height - (coords.bottom_row * height)
    };
  }

  setFaceBoxes = (boxes) => {
    this.setState({ faceBoxes: boxes });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value })
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input })

    app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
          if (response) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({
                  id: this.state.user.id
              })
            })
            .then(response => response.json())
            .then(count => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
          }
          // An array which stores face coords
          const faces = response.outputs[0].data.regions;
          const faceBoxes = faces.map(face => {
              return this.calculateFaceLocation(face.region_info.bounding_box);
            }
          );
          this.setFaceBoxes(faceBoxes);
        }
      )
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState({ isSignedIn: false });
    } else if (route === 'home') {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  }

  render() {
    console.log(this.state.user.entries);

    return (
      <div className="App">
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn} />
        {
          this.state.route === 'home' ?
            <>
              <Logo />
              <Rank userName={this.state.user.name} userEntries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
              <FaceRecognition boxes={this.state.faceBoxes} imageUrl={this.state.imageUrl} />
            </> :
            (
              this.state.route === 'signin' ?
                <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} /> :
                <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            )
        }
      </div>
    );
  }
}


export default App;
