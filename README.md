# react-typescript-kakao-map-test

[https://apis.map.kakao.com/web/](https://apis.map.kakao.com/web/)

[https://apis.map.kakao.com/web/guide/](https://apis.map.kakao.com/web/guide/)

[https://developers.kakao.com/](https://developers.kakao.com/)

> 내 애플리케이션 ⇒ 애플리케이션 추가하기 ⇒ 생성 ⇒ 앱키 (javascript 키 복사)
> 

`create-react-app kakao-map --template typescript`

React 실행 전에 가지고 올 수 있도록 `public` 의 `index.html` 으로 가져온다!

```jsx
<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=발급받은 APP KEY를 넣으시면 됩니다."></script>
```

보안을 위해 

> 내애플리케이션 ⇒ 앱설정 ⇒ 플랫폼 ⇒ Web 플랫폼 등록([http://localhost:3000](http://localhost:3000/))
> 

React 를 지원하지 않는 프레임워크 가져오기!

```tsx
// src/App.tsx
import React, { useEffect } from 'react';

// typescript 에서 kakao 는 에러가 발생함. window 로 가지고와서 사용!
declare global {
  interface Window {
    kakao: any
  }
}

function App() {

  useEffect(() => {
    const container = document.getElementById('map');

		var options = {
			center: new window.kakao.maps.LatLng(33.450701, 126.570667),
			level: 3
		};

		var map = new window.kakao.maps.Map(container, options);
  }, []);

  return (
    <div>
      <div id='map' style={{ width: 300, height: 300 }}></div>
    </div>
  );
}

export default App;
```

또는

```html
// public/index.html
<head>
	<script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=76b4fadf4a74f8c17d93cb8d1e5742c1"></script>
    <script>
      function loadMap() {
        const container = document.getElementById('map');

        var options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667),
          level: 3
        };

        var map = new window.kakao.maps.Map(container, options);
      }
    </script>
</head>
```

```tsx
// src/App.tsx
import React, { useEffect } from 'react';

declare global {
  interface Window {
    loadMap: () => void;
  }
}

function App() {

  useEffect(() => {
    window.loadMap()
  }, []);

  return (
    <div>
      <div id='map' style={{ width: 300, height: 300 }}></div>
    </div>
  );
}

export default App;
```

# React 로 가져오기(최적화)

## 방법1

```tsx
// src/App.tsx
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any
  }
}

function App() {
  // React 에서는 id 사용을 권장하지 않음! useRef 로 가져옴
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    
    // 이슈 방지
    if(mapRef.current) {

      var options = {
        center: new window.kakao.maps.LatLng(33.450701, 126.570667),
        level: 3
      };

      var map = new window.kakao.maps.Map(mapRef.current, options);
      }

  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ width: 300, height: 300 }}></div>
    </div>
  );
}

export default App;
```

# 방법2(추천!)

kakao map 을 사용할 때만 로딩

디버깅 시 에러 발생을 줄임

```tsx
// src/App.tsx
import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any
  }
}

function App() {
  // React 에서는 id 사용을 권장하지 않음! useRef 로 가져옴
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
		// script 를 동적으로 생성
    const script = document.createElement('script')
    
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=76b4fadf4a74f8c17d93cb8d1e5742c1&autoload=false"
    
    document.head.appendChild(script)
    
    script.onload = () => {
      if(mapRef.current) {
				// kakao map 이 load 되면 실행
        window.kakao.maps.load(() => {
          var options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3
          };
    
          var map = new window.kakao.maps.Map(mapRef.current, options);
        })
      }
    }
		return () => script.remove()
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ width: 300, height: 300 }}></div>
    </div>
  );
}

export default App;
```
