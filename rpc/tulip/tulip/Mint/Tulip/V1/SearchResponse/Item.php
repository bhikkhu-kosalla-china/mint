<?php
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: tulip.proto

namespace Mint\Tulip\V1\SearchResponse;

use Google\Protobuf\Internal\GPBType;
use Google\Protobuf\Internal\RepeatedField;
use Google\Protobuf\Internal\GPBUtil;

/**
 * Generated from protobuf message <code>mint.tulip.v1.SearchResponse.Item</code>
 */
class Item extends \Google\Protobuf\Internal\Message
{
    /**
     * Generated from protobuf field <code>double rank = 1;</code>
     */
    protected $rank = 0.0;
    /**
     * Generated from protobuf field <code>string highlight = 2;</code>
     */
    protected $highlight = '';
    /**
     * Generated from protobuf field <code>int32 book = 3;</code>
     */
    protected $book = 0;
    /**
     * Generated from protobuf field <code>int32 paragraph = 4;</code>
     */
    protected $paragraph = 0;
    /**
     * Generated from protobuf field <code>string content = 5;</code>
     */
    protected $content = '';

    /**
     * Constructor.
     *
     * @param array $data {
     *     Optional. Data for populating the Message object.
     *
     *     @type float $rank
     *     @type string $highlight
     *     @type int $book
     *     @type int $paragraph
     *     @type string $content
     * }
     */
    public function __construct($data = NULL) {
        \GPBMetadata\Tulip::initOnce();
        parent::__construct($data);
    }

    /**
     * Generated from protobuf field <code>double rank = 1;</code>
     * @return float
     */
    public function getRank()
    {
        return $this->rank;
    }

    /**
     * Generated from protobuf field <code>double rank = 1;</code>
     * @param float $var
     * @return $this
     */
    public function setRank($var)
    {
        GPBUtil::checkDouble($var);
        $this->rank = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>string highlight = 2;</code>
     * @return string
     */
    public function getHighlight()
    {
        return $this->highlight;
    }

    /**
     * Generated from protobuf field <code>string highlight = 2;</code>
     * @param string $var
     * @return $this
     */
    public function setHighlight($var)
    {
        GPBUtil::checkString($var, True);
        $this->highlight = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>int32 book = 3;</code>
     * @return int
     */
    public function getBook()
    {
        return $this->book;
    }

    /**
     * Generated from protobuf field <code>int32 book = 3;</code>
     * @param int $var
     * @return $this
     */
    public function setBook($var)
    {
        GPBUtil::checkInt32($var);
        $this->book = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>int32 paragraph = 4;</code>
     * @return int
     */
    public function getParagraph()
    {
        return $this->paragraph;
    }

    /**
     * Generated from protobuf field <code>int32 paragraph = 4;</code>
     * @param int $var
     * @return $this
     */
    public function setParagraph($var)
    {
        GPBUtil::checkInt32($var);
        $this->paragraph = $var;

        return $this;
    }

    /**
     * Generated from protobuf field <code>string content = 5;</code>
     * @return string
     */
    public function getContent()
    {
        return $this->content;
    }

    /**
     * Generated from protobuf field <code>string content = 5;</code>
     * @param string $var
     * @return $this
     */
    public function setContent($var)
    {
        GPBUtil::checkString($var, True);
        $this->content = $var;

        return $this;
    }

}

// Adding a class alias for backwards compatibility with the previous class name.
class_alias(Item::class, \Mint\Tulip\V1\SearchResponse_Item::class);

