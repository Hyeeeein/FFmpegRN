# FFmpeg

> 1. FFmpeg?

FFmpeg 은 다양한 멀티미디어 형식의 처리, 변환, 스트리밍을 지원하는 오픈 소스 프로젝트로 모든 디지털 영상과 음성에 대한 인코딩과 디코딩 및 스트리밍이 가능하다. 비디오 변환, 자르기, 붙이기, 필터 적용, 실시간 스트리밍 등 다양한 기능을 제공하여 멀티미디어 처리에 있어 필수적인 역할을 한다.

프로젝트 자체가 모든 영상의 디코딩과 인코딩을 지향하기 때문에 추가적인 코덱의 설치가 필요 없다. 기타 인코더들을 쓰는 것보다 직접 FFmpeg을 이용해서 프리셋을 활용하는 것이 더 나은 화질을 보장한다.

</br>

> 2. ffmpeg-kit-react-native

FFmpegKit 은 응용 프로그램에서 FFmpeg/FFprobe 명령을 쉽게 실행할 수 있게 해주는 래퍼 라이브러리로 네이티브 플랫폼과 하이브리드 플랫폼 모두 지원한다. ([ffmpeg-kit-react-native](https://github.com/arthenica/ffmpeg-kit?tab=readme-ov-file))

```js
import {FFmpegKit, FFprobeKit} from 'ffmpeg-kit-react-native';

// 미디어 포맷 변환 도구
FFmpegKit.execute(ffmpegCommand).then(async session => {
  const sessionId = session.getSessionId(); // 고유한 세션 ID
  const state = await session.getState(); // 실행의 상태
  const arguments = session.getArguments(); // 명령어의 각 인수
  const returnCode = await session.getReturnCode(); // 완료된 세션에 대한 반환 코드
  const startTime = session.getStartTime(); // 시작된 시간
  const endTime = await session.getEndTime(); // 종료된 시간
  const duration = await session.getDuration(); // 실행 시간
  const output = await session.getOutput(); // 콘솔 출력
  const logs = await session.getLogs(); // 로그 목록
});

// 미디어 정보 표시 도구
FFprobeKit.execute(ffprobeCommand).then(async session => {});
```

execute 함수 이 외에도 미디어 정보를 가져오거나, 실행 중인 작업을 중지하는 등의 함수를 제공한다.

</br>

> 3. 주요 사용 명령어

동영상의 해상도를 변환하는 명령어

```
-i ${originPath} -s 1280x720 -c:a copy ${convertPath}
```

- `-i ${originPath}` : 입력 파일을 지정
- `-s 1280x720` : 동영상의 해상도를 지정
- `-c:a copy` : 오디오를 재인코딩하지 않고 원본 파일에서 복사
- `${convertPath}` : 출력 파일의 경로 지정

</br>

동영상에서 특정 시간의 이미지 추출하는 명령어

```
-ss ${time} -i ${originPath} -frames:v 1 -q:v 2 ${imagePath}
```

- `-ss ${time}` : 입력 동영상 파일에서 추출을 시작할 시간을 지정
- `-frames:v 1` : 비디오 프레임 수를 지정
- `-c:a copy` : 오디오를 재인코딩하지 않고 원본 파일에서 복사
- `-q:v 2` : 비디오 품질을 조절, 값이 낮을수록 품질이 높아짐
- `${imagePath}` : 출력 이미지 파일의 경로를 지정
