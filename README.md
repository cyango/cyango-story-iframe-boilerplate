# Cyango Story Iframe Example

This project provides a simple web interface to view and interact with Cyango stories through an iframe. It includes a sidebar with scene navigation buttons and uses postMessage for communication between the parent page and the iframe.

## Setup

1. Clone this repository to your local machine.
2. Open the `index.html` file in a text editor.
3. Locate the `<iframe>` tag and update the `src` attribute with your desired Cyango story URL. The URL should follow this format:

   ```html
   <iframe
     id="storyIframe"
     src="https://story.cyango.com/YOUR_STORY_ID"
     frameborder="0"
   ></iframe>
   ```

   Replace `YOUR_STORY_ID` with the actual ID of your Cyango story.

4. Scene buttons are created dynamically from your story's `storyJson.scenes` using the story ID in the iframe URL.
   You only need to set a valid story URL in `index.html`.

5. Replace the `logo.png` file with your own logo image.
6. Save the changes to `index.html`.
7. Open `index.html` in a web browser to view your story.

## Features

- Sidebar with dynamic scene navigation buttons
- Collapsible sidebar for full-screen viewing
- Communication with the Cyango story iframe using postMessage

## Communication with the Iframe

This project uses the postMessage API to communicate with the Cyango story iframe. The main action supported is:

- `GO_TO_SCENE`: Change the current scene in the story

### How it works

When a scene button is clicked, the parent page sends a Cyango `IAction` message to the iframe with the following structure:

{
  type: "GO_TO_SCENE",
  targetSceneId: "scene_id_here"
}

The Cyango story iframe should be set up to listen for these messages and handle the scene changes accordingly.

The example first loads scenes by calling:

`POST https://api.cyango.com/story/getStoryJsonById`

## Customization

You can customize the appearance of the sidebar and buttons by modifying the `styles.css` file.

### Changing Colors

To change the color scheme, modify the following CSS properties in `styles.css`:

- Sidebar background: `.sidebar` background-color
- Button colors: `.scene-button` background-color and color
- Toggle button: `.toggle-btn` background

### Static fallback buttons (optional)

If you want a fallback for offline/CORS failures, you can keep manual `.scene-button` elements inside the `button-container` in `index.html`.

## Troubleshooting

If you encounter any issues with communication between the parent page and the iframe, ensure that:

1. The iframe URL is correct and starts with `https://www.cyango.com/story/`.
2. The Cyango story is set up to receive and handle postMessage events.
3. There are no content security policies (CSP) blocking the communication.

## Browser Compatibility

This project should work in all modern browsers that support ES6 and the postMessage API, including:

- Google Chrome (latest version)
- Mozilla Firefox (latest version)
- Microsoft Edge (latest version)
- Safari (latest version)

## License

This project is released under the MIT License. See the LICENSE file for details.

For any other issues or questions, please re
