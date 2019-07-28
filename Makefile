FILE_RAW = ./sketch.m4
FILE = ./sketch.sh

build: $(FILE)
	echo "Built sketch.sh"

.PHONY: clean
clean:
	rm -f ./build/*


$(FILE):
	argbash $(FILE_RAW) -o $(FILE)
