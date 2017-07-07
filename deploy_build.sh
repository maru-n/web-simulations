#!/bin/sh

DIST_DIR=dist

PROJECT_DIR=`dirname "${0}"`
expr "${0}" : "/.*" > /dev/null || PROJECT_DIR=`(cd "${PROJECT_DIR}" && pwd)`

DIST_DIR=${PROJECT_DIR}/${DIST_DIR}
mkdir -p ${DIST_DIR} 2>/dev/null
cp -f ${PROJECT_DIR}/index.html ${DIST_DIR}

# legacy projects
cd ${PROJECT_DIR}/legacy
gulp build-release:all
cp -fr ${PROJECT_DIR}/legacy/dist/double_pendulum ${DIST_DIR}/double_pendulum
cp -fr ${PROJECT_DIR}/legacy/dist/scl ${DIST_DIR}/scl

for TARGET in GrayScott MovingSpot
do
    cd ${PROJECT_DIR}/${TARGET}
    target_url=`echo ${TARGET} | sed -r -e 's/^([A-Z])/\L\1\E/' -e 's/([A-Z])/_\L\1\E/g'`
    echo $target_snk
    npm install
    npm run build
    cp -fr ${PROJECT_DIR}/${TARGET}/build ${DIST_DIR}/${target_url}
done
