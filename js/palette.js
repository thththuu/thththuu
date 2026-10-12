const buildPalette = (colorsList) => {
  const paletteContainer = document.getElementById("palette");
  paletteContainer.innerHTML = "";
  
  const orderedByColor = orderByLuminance(colorsList);
  
  for (let i = 0; i < orderedByColor.length; i++) {
    const hexColor = rgbToHex(orderedByColor[i]);
    
    if (i > 0) {
      const difference = calculateColorDifference(
        orderedByColor[i],
        orderedByColor[i - 1]
        );
        if (difference < 120) {
          continue;
        }
      }
      
      const colorElement = document.createElement("div");
      colorElement.style.backgroundColor = hexColor;
      colorElement.appendChild(document.createTextNode(hexColor));
      paletteContainer.appendChild(colorElement);
    }
  };
  
  const rgbToHex = (pixel) => {
    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    };
    
    return (
      "#" +
      componentToHex(pixel.r) +
      componentToHex(pixel.g) +
      componentToHex(pixel.b)
      ).toUpperCase();
    };
    
    const orderByLuminance = (rgbValues) => {
      const calculateLuminance = (p) => {
        return 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
      };
      
      return rgbValues.sort((p1, p2) => {
        return calculateLuminance(p2) - calculateLuminance(p1);
      });
    };
    
    const buildRgb = (imageData) => {
      const rgbValues = [];
      for (let i = 0; i < imageData.length; i += 4) {
        const rgb = {
          r: imageData[i],
          g: imageData[i + 1],
          b: imageData[i + 2],
        };
        
        rgbValues.push(rgb);
      }
      
      return rgbValues;
    };
    
    const calculateColorDifference = (color1, color2) => {
      const rDifference = Math.pow(color2.r - color1.r, 2);
      const gDifference = Math.pow(color2.g - color1.g, 2);
      const bDifference = Math.pow(color2.b - color1.b, 2);
      
      return rDifference + gDifference + bDifference;
    };
    
    const findBiggestColorRange = (rgbValues) => {
      let rMin = Number.MAX_VALUE;
      let gMin = Number.MAX_VALUE;
      let bMin = Number.MAX_VALUE;
      
      let rMax = Number.MIN_VALUE;
      let gMax = Number.MIN_VALUE;
      let bMax = Number.MIN_VALUE;
      
      rgbValues.forEach((pixel) => {
        rMin = Math.min(rMin, pixel.r);
        gMin = Math.min(gMin, pixel.g);
        bMin = Math.min(bMin, pixel.b);
        
        rMax = Math.max(rMax, pixel.r);
        gMax = Math.max(gMax, pixel.g);
        bMax = Math.max(bMax, pixel.b);
      });
      
      const rRange = rMax - rMin;
      const gRange = gMax - gMin;
      const bRange = bMax - bMin;
      
      const biggestRange = Math.max(rRange, gRange, bRange);
      if (biggestRange === rRange) {
        return "r";
      } else if (biggestRange === gRange) {
        return "g";
      } else {
        return "b";
      }
    };
    
    const quantization = (rgbValues, depth) => {
      const MAX_DEPTH = 4;
      
      // Base case
      if (depth === MAX_DEPTH || rgbValues.length === 0) {
        const color = rgbValues.reduce(
          (prev, curr) => {
            prev.r += curr.r;
            prev.g += curr.g;
            prev.b += curr.b;
            
            return prev;
          },
          {
            r: 0,
            g: 0,
            b: 0,
          }
          );
          
          color.r = Math.round(color.r / rgbValues.length);
          color.g = Math.round(color.g / rgbValues.length);
          color.b = Math.round(color.b / rgbValues.length);
          
          return [color];
        }
        const componentToSortBy = findBiggestColorRange(rgbValues);
        rgbValues.sort((p1, p2) => {
          return p1[componentToSortBy] - p2[componentToSortBy];
        });
        
        const mid = rgbValues.length / 2;
        return [
          ...quantization(rgbValues.slice(0, mid), depth + 1),
          ...quantization(rgbValues.slice(mid + 1), depth + 1),
        ];
      };
      
      const main = () => {
        const canvas = document.getElementById("canvas");
        const ctx = canvas.getContext('2d')
        const image = new Image();
        
        
        image.onload = () => {
          ctx.drawImage(image, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const rgbArray = buildRgb(imageData.data);
          const quantColors = quantization(rgbArray, 0);
          
          buildPalette(quantColors);
        }
        
        image.crossOrigin = "Anonymous";
        image.src = "https://i.ibb.co/HzbQ8MM/sofew.png";
        
        canvas.onclick = () => {
          if (image.src.match("w6a")) {
            image.src = "https://i.ibb.co/HzbQ8MM/sofew.png";
          } else {
            image.src = "https://i.ibb.co/XSzWh9g/w6a.png";
          }
        }
      };
      
      main();
      