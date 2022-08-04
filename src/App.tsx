import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    kakao: any
  }
}

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [markerList, setMarkerList] = useState<any[]>([]);
  // const [map, setMap] = useState<any>();
  // useRef 를 좀 더 좋음
  const map = useRef<any>(null);

  useEffect(() => {

    const script = document.createElement('script')
    
    script.src = "//dapi.kakao.com/v2/maps/sdk.js?appkey=76b4fadf4a74f8c17d93cb8d1e5742c1&autoload=false"
    
    document.head.appendChild(script)
    
    script.onload = () => {
      if(mapRef.current) {

        window.kakao.maps.load(() => {
          var options = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
            // draggable: false
          };
  
          // setMap(new window.kakao.maps.Map(mapRef.current, options));
          map.current = new window.kakao.maps.Map(mapRef.current, options); 
        
          window.kakao.maps.event.addListener(map.current, 'rightclick', (mouseEvent: any) => {

            console.log(window.kakao.maps.Marker)

              const latlng = mouseEvent.latLng;

              const title = prompt("마커의 타이틀을 입력해주세요")

              const marker = new window.kakao.maps.Marker({
                map: map.current,
                position: latlng,
                title
            });
            setMarkerList(prev => [...prev, marker])
          });
      
        })

      }
    }
    return () => script.remove()
  }, []);


  return (
    <div>
      {/* <button onClick={() => { 
        map.setCenter(new window.kakao.maps.LatLng(37.5642135, 127.0016985)) 
      }}>서울</button>
      <button onClick={() => { 
        map.setCenter(new window.kakao.maps.LatLng(35.1379222, 129.05562775)) 
      }}>부산</button> */}
      <button onClick={() => { 
        map.current.setCenter(new window.kakao.maps.LatLng(37.5642135, 127.0016985)) 
        // map.current.setLevel(10)
      }}>서울</button>
      <button onClick={() => { 
        map.current.setCenter(new window.kakao.maps.LatLng(35.1379222, 129.05562775))
        // map.current.setLevel(5)
      }}>부산</button>
      <input type="range" min="1" max="20" onChange={(e) => 
        map.current.setLevel(e.currentTarget.value, {animate: true})
      }/>
      <button onClick={() => { 
        map.current.setMapTypeId(window.kakao.maps.MapTypeId.HYBRID);
      }}>지도 타입 변경</button>
      <div ref={mapRef} style={{ width: 300, height: 300 }}></div>
      {
        markerList.map(value => <div onClick={() => { 
          value.setMap(null)
          setMarkerList(markerList.filter(v => v !== value))
        }}>
          {value.getTitle()}
        </div> )
      }
    </div>
  );
}

export default App;
