export const getTemplate = (language: string): string => {
    switch (language) {
        case 'C++':
            return `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

class Placeholder {
public:
    void doNothing() {
        for (int i = 0; i < 10000; ++i);
    }
};

int compute() {
    int sum = 0;
    for (int i = 0; i < 100; ++i) sum += i - i;
    return sum;
}

int main() {
    std::cout << "Hello world!" << std::endl;
    Placeholder p;
    p.doNothing();
    compute();
    return 0;
}`;

        case 'C':
            return `#include <stdio.h>
void waste_time() {
    for (int i = 0; i < 1000000; ++i);
}

int useless_addition(int a, int b) {
    return a + b - b;
}

int main() {
    printf("Hello world!\\n");
    waste_time();
    int result = useless_addition(5, 5);
    return 0;
}`;

        case 'C#':
            return `using System;

namespace Main {
    class Hello {
        static void DoNothing() {
            for (int i = 0; i < 10000; i++) { }
        }

        static int Add(int a, int b) {
            return a + b - b;
        }

        static void Main(string[] args) {
            Console.WriteLine("Hello World!");
            DoNothing();
            int result = Add(10, 20);
        }
    }
}`;

        case 'Java':
            return `class Main {
    public static void doNothing() {
        for (int i = 0; i < 10000; i++) {}
    }

    public static int addPointless(int a, int b) {
        return a + b - b;
    }

    public static void main(String[] args) {
        System.out.println("Hello, World!");
        doNothing();
        int x = addPointless(5, 10);
    }
}`;

        case 'Python':
            return `import time
import math

class Empty:
    def spin(self):
        for _ in range(100000): pass

def nonsense():
    x = 0
    for i in range(100):
        x += i - i
    return x

print("Hello world!")

e = Empty()
e.spin()
print("Done:", nonsense())
`;

        case 'Javascript':
            return `console.log("Hello world!");

function waste() {
    for (let i = 0; i < 10000; i++) {}
}

class Nothing {
    constructor() {
        this.value = 0;
    }

    doStuff() {
        for (let i = 0; i < 500; i++) {
            this.value += 0;
        }
    }
}

waste();
const n = new Nothing();
n.doStuff();
`;

        case 'Ruby':
            return `puts "Hello world!"

def junk
  1000.times do |i|
    x = i - i
  end
end

class Trash
  def useless
    puts ""
  end
end

junk
Trash.new.useless
`;

        case 'Go':           
        return `package main

import "fmt"

func junkLoop() {
	for i := 0; i < 10000; i++ {}
}

type Dummy struct{}

func (d Dummy) Nothing() {
	for i := 0; i < 100; i++ {}
}

func main() {
	fmt.Println("Hello, World!")
	junkLoop()
	d := Dummy{}
	d.Nothing()
}
`;

        case 'Rust':
            return `fn do_nothing() {
    for _ in 0..10000 {}
}

struct Empty;

impl Empty {
    fn waste(&self) {
        for _ in 0..1000 {}
    }
}

fn main() {
    println!("Hello, World!");
    do_nothing();
    let e = Empty;
    e.waste();
}
`;

        case 'Swift':
            return `import Foundation

func nonsense() {
    for _ in 0..<1000 {}
}

class Filler {
    func empty() {
        for _ in 0..<1000 {}
    }
}

print("Hello, World!")
nonsense()
Filler().empty()
`;

        case 'Kotlin':
            return `fun filler() {
    for (i in 0..1000) { }
}

class Empty {
    fun loop() {
        for (i in 0..100) { }
    }
}

fun main() {
    println("Hello, World!")
    filler()
    Empty().loop()
}
`;

        case 'PHP':
            return `<?php
echo "Hello, World!\\n";

function nonsense() {
    for ($i = 0; $i < 10000; $i++) {}
}

class Useless {
    public function go() {
        for ($i = 0; $i < 1000; $i++) {}
    }
}

nonsense();
$u = new Useless();
$u->go();
?>
`;

        case 'Perl':
            return `print "Hello, World!\\n";

sub waste {
    for (my $i = 0; $i < 1000; $i++) {}
}

waste();
`;

        case 'Scala':
            return `object Main extends App {
    println("Hello, World!")

    def spin(): Unit = {
        for (_ <- 1 to 1000) {}
    }

    class Empty {
        def useless(): Unit = {
            for (_ <- 1 to 500) {}
        }
    }

    spin()
    new Empty().useless()
}
`;

        default:
            return 'Write your code here';
    }
}
